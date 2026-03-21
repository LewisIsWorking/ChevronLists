import * as vscode from 'vscode';
import * as path from 'path';
import { isHeader } from './patterns';

interface DeadLink { file: string; line: number; link: string; kind: 'section' | 'file'; }

const SECTION_LINK_RE = /\[\[([^\]#:]+)\]\]/g;
const FILE_LINK_RE    = /\[\[file:([^\]#]+?)(?:#[^\]]+)?\]\]/g;

/** Command: scans workspace for broken [[section]] and [[file:]] links */
export async function onFindDeadLinks(): Promise<void> {
    const files   = await vscode.workspace.findFiles('**/*.md', '**/node_modules/**');
    const dead: DeadLink[] = [];

    await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: 'CL: Checking links…', cancellable: false },
        async () => {
            // Build a map of file → set of section names
            const sectionMap = new Map<string, Set<string>>();
            const fileNames  = new Set(files.map(f => path.basename(f.fsPath)));
            for (const uri of files) {
                const doc  = await vscode.workspace.openTextDocument(uri);
                const secs = new Set<string>();
                for (let i = 0; i < doc.lineCount; i++) {
                    if (isHeader(doc.lineAt(i).text)) {
                        secs.add(doc.lineAt(i).text.replace(/^> /, '').trim().toLowerCase());
                    }
                }
                sectionMap.set(uri.fsPath, secs);
            }

            // Check each file's links
            for (const uri of files) {
                const doc      = await vscode.workspace.openTextDocument(uri);
                const fileName = path.basename(uri.fsPath);
                const localSections = sectionMap.get(uri.fsPath) ?? new Set();

                for (let i = 0; i < doc.lineCount; i++) {
                    const text = doc.lineAt(i).text;
                    for (const m of text.matchAll(SECTION_LINK_RE)) {
                        const target = m[1].trim().toLowerCase();
                        if (!localSections.has(target)) {
                            dead.push({ file: fileName, line: i, link: m[1], kind: 'section' });
                        }
                    }
                    for (const m of text.matchAll(FILE_LINK_RE)) {
                        if (!fileNames.has(m[1].trim())) {
                            dead.push({ file: fileName, line: i, link: `file:${m[1]}`, kind: 'file' });
                        }
                    }
                }
            }
        }
    );

    if (dead.length === 0) {
        vscode.window.showInformationMessage(`CL: No dead links found across ${files.length} files ✅`);
        return;
    }

    const lines = dead.map(d => `- ${d.file} line ${d.line + 1}: [[${d.link}]] (${d.kind} not found)`);
    const content = `# Dead Links Report\n\n${dead.length} broken link${dead.length === 1 ? '' : 's'} found\n\n${lines.join('\n')}`;
    const mdDoc   = await vscode.workspace.openTextDocument({ content, language: 'markdown' });
    await vscode.window.showTextDocument(mdDoc, vscode.ViewColumn.Beside);
}

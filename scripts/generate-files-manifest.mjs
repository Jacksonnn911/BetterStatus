#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = resolve(repositoryRoot, "src");
const commit = process.argv[2] ?? process.env.GITHUB_SHA;

if (!commit || !/^[0-9a-f]{40}$/i.test(commit))
    throw new Error("Usage: generate-files-manifest.mjs <commit-sha>");

async function listFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const path = resolve(directory, entry.name);
        if (entry.isDirectory())
            files.push(...await listFiles(path));
        else if (entry.isFile())
            files.push(path);
    }

    return files;
}

const sourceFiles = [
    ...await listFiles(sourceRoot),
    resolve(repositoryRoot, "README.md")
];
const excludedSources = new Set(["src/SavedStatusesProfile.tsx"]);
const files = [];

for (const path of sourceFiles) {
    const source = relative(repositoryRoot, path).split(sep).join("/");
    if (excludedSources.has(source))
        continue;

    const target = source === "README.md"
        ? source
        : relative(sourceRoot, path).split(sep).join("/");
    const contents = await readFile(path);

    files.push({
        source,
        target,
        sha256: createHash("sha256").update(contents).digest("hex")
    });
}

files.sort((first, second) => first.target.localeCompare(second.target));

await writeFile(
    resolve(repositoryRoot, "files.json"),
    `${JSON.stringify({ version: 1, commit: commit.toLowerCase(), generatedAt: new Date().toISOString(), files }, null, 2)}\n`,
    "utf8"
);

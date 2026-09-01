#!/usr/bin/env python3

import os
import re


class Linting(object):
    path = None
    import_regex = re.compile(r'^import +{(.+)} from (.+)')
    extra_whitespace_regex = re.compile(r'{\s*([^\s}]+)\s*}')

    def __init__(self, path):
        self.path = path

    def lint(self):
        count = 0

        for root, dirs, files in os.walk(self.path):
            for file in files:
                if file.endswith('.ts') and '.spec.' not in file:
                    self.lint_imports(os.path.join(root, file))
                    count += 1

        print('Linted {} files.'.format(count))

    def lint_imports(self, file):
        imports = {}
        temp_file = '{}.linting.ts'.format(file)
        imports_done = False  # True after first non-blank, non-import line.

        with open(temp_file, 'w') as OUT:
            with open(file, 'r') as IN:
                for line in IN.readlines():
                    import_matcher = self.import_regex.match(line)
                    if import_matcher:
                        if import_matcher.group(2) in imports:
                            imports[import_matcher.group(2)].append(import_matcher.group(1))
                        else:
                            imports[import_matcher.group(2)] = [import_matcher.group(1)]
                    elif imports_done or line.strip() != '':
                        if len(imports) > 0:
                            for import_file, import_names in imports.items():
                                OUT.write(f'import {{{", ".join(sorted(import_names))}}} from {import_file}\n')
                            OUT.write('\n')
                            imports = {}
                        imports_done = True
                        OUT.write(line)

        os.rename(temp_file, file)


if __name__ == '__main__':
    linting = Linting('src/app')
    linting.lint()

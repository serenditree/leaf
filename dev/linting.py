#!/usr/bin/env python3

import os
import re
import functools


class ImportCompare(object):
    constant_regex = re.compile(r'.*\{[A-Z][A-Z_].*')

    def compare(self, x, y):
        x_matcher = self.constant_regex.match(x)
        y_matcher = self.constant_regex.match(y)

        if x_matcher and not y_matcher:
            result = -1
        elif y_matcher and not x_matcher:
            result = 1
        elif y > x:
            result = -1
        elif x > y:
            result = 1
        else:
            raise ValueError('Duplicated import!')

        return result


class Linting(object):
    path = None
    comparison = ImportCompare()
    multi_import_regex = re.compile(r'^import +{(.+,.+)}(.+)')
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
        import_lines = []
        temp_file = '{}.linting.ts'.format(file)
        imports_done = False  # True after first non-blank, non-import line.

        with open(temp_file, 'w') as OUT:
            with open(file, 'r') as IN:
                for line in IN.readlines():
                    multi_import_matcher = self.multi_import_regex.match(line)
                    if multi_import_matcher:
                        for single_import in multi_import_matcher.group(1).split(','):
                            import_lines.append(
                                'import {{{0}}} {1}'.format(
                                    single_import.strip(),
                                    multi_import_matcher.group(2).strip()
                                )
                            )
                    elif line.startswith('import'):
                        import_lines.append(
                            self.extra_whitespace_regex.sub(
                                lambda matcher: '{{{}}}'.format(matcher.group(1)),
                                line.strip()
                            )
                        )
                    elif imports_done or line.strip() != '':
                        if len(import_lines) > 0:
                            OUT.write(
                                '{}\n\n'.format(
                                    '\n'.join(sorted(import_lines, key=functools.cmp_to_key(self.comparison.compare)))
                                )
                            )
                            import_lines = []
                        imports_done = True
                        OUT.write(line)

        os.rename(temp_file, file)


if __name__ == '__main__':
    linting = Linting('src/app')
    linting.lint()

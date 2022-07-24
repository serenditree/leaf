#!/usr/bin/env python3

import json
import re


class Yarn(object):
    package_json_path = None
    package_json = None
    yarn_lock_path = None

    package_regex = re.compile(r'"?([^, ]+?)@(([\\^~<>=]*)([^",:]+))')
    package_start_regex = re.compile(r'^' + package_regex.pattern)
    version_regex = re.compile(r'^\s{2}version "(.+)"')

    def __init__(self, package_json_path, yarn_lock_path):
        self.package_json_path = package_json_path
        self.yarn_lock_path = yarn_lock_path

        with open(package_json_path, 'r') as PACKAGE_JSON:
            self.package_json = json.load(PACKAGE_JSON)

    def sync(self):
        package_name = ''
        package_ranges = ''

        with open(self.yarn_lock_path, 'r') as YARN_LOCK:
            for line in YARN_LOCK.readlines():
                package_start_matcher = self.package_start_regex.match(line)
                if package_start_matcher:
                    package_name = package_start_matcher.group(1)
                    package_ranges = line
                else:
                    version_matcher = self.version_regex.match(line)
                    if version_matcher:
                        if package_name in self.package_json['dependencies']:
                            self.set_version('dependencies', package_ranges, version_matcher.group(1))
                        elif package_name in self.package_json['devDependencies']:
                            self.set_version('devDependencies', package_ranges, version_matcher.group(1))

        with open(self.package_json_path, 'w') as PACKAGE_JSON:
            json.dump(self.package_json, PACKAGE_JSON, indent=' ' * 4)

    def set_version(self, dependencies, package_ranges, resolved_version):
        for package_name, package_range, range_modifier, version in self.package_regex.findall(package_ranges):
            if self.package_json[dependencies][package_name] == package_range and version != resolved_version:
                print('{} ({}) {} => {}'.format(package_name, range_modifier, version, resolved_version))
                self.package_json[dependencies][package_name] = range_modifier + resolved_version


if __name__ == '__main__':
    yarn = Yarn('package.json', 'yarn.lock')
    yarn.sync()

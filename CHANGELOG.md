# Changelog

## [1.0.4] - 2019-08-12
### Fix
- Fix types in response classes
- Fix response headers

## [1.0.3] - 2019-08-01
### Fix
- Fix wrong package name in readme

## [1.0.2] - 2019-06-25
### Fix
- Fix prepublishOnly script

## [1.0.1] - 2019-06-25
### Change
- Rename repository namespace to @loremipsum
- Ignore sub directories when using the cli utility
- Add flag to disable compilation

## [1.0.0] - 2019-05-28
### Add
- travis + coveralls setup

### Change
- Update package.json

## [0.4.0] - 2019-05-28
### Add
- Add `Container`
- Add application configuration to `@App` decorator
- Add bin utility

### Change
- Modularized Hans (with adapters!)
- Refactor getting/setting metadata (`Metadata` helper class)

## [0.3.0] - 2019-04-09
### Add
- Add `TemplateResponse`
- Add `FileResponse`
- Add `TemplateResponse`
- Add local and global state capabilities
- Add middleware
- Add random generator for weighted elements
- Add faker library and proper examples
- Add simplified import paths
- Add body parser middleware by default
- Add linting for Hans

### Change
- Refactor (aka improve) code
- Move examples to examples directory
- Move metadata keys to separate enum

### Fix
- Automatically add missing slashes for routes

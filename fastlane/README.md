fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
## iOS
### ios upload_testflight
```
fastlane ios upload_testflight
```
Upload to Testflight
### ios production_circle
```
fastlane ios production_circle
```
Build project
### ios provision_for_production
```
fastlane ios provision_for_production
```
Set up provisioning
### ios get_version_numbers_for_production
```
fastlane ios get_version_numbers_for_production
```
Get version numbers
### ios staging_circle
```
fastlane ios staging_circle
```
Build project
### ios provision_for_staging
```
fastlane ios provision_for_staging
```
Set up provisioning
### ios get_version_numbers_for_staging
```
fastlane ios get_version_numbers_for_staging
```
Get version numbers

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).

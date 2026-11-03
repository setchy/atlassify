# Changelog

## [3.17.2](https://github.com/setchy/atlassify/compare/v3.17.1...v3.17.2) (2026-10-29)


### 🐛 Bug Fixes

* **api:** paginate past short notification pages ([#3979](https://github.com/setchy/atlassify/issues/3979)) ([34b12b4](https://github.com/setchy/atlassify/commit/34b12b4dce54e900190282b7897a8903759057e4))
* **i18n:** follow the OS language until the user chooses one ([#3977](https://github.com/setchy/atlassify/issues/3977)) ([e3d76f1](https://github.com/setchy/atlassify/commit/e3d76f1502fbb6fc7bd98ea1c50d73e26e255974))


### 🧼 Code Refactoring

* **i18n:** adopt t() defaultValue as the source of English ([#3830](https://github.com/setchy/atlassify/issues/3830)) ([00195ae](https://github.com/setchy/atlassify/commit/00195aea2141fb9033e35e2968ca91a71719050b))


### 📦 Dependency Updates (Core)

* **deps-core:** update @atlaskit/select to v23.1.4 ([#3980](https://github.com/setchy/atlassify/issues/3980)) ([f59217e](https://github.com/setchy/atlassify/commit/f59217e720bbbe85be953775fe8f0703769b3782))
* **deps-core:** update @atlaskit/tokens to v20.8.0 ([#3981](https://github.com/setchy/atlassify/issues/3981)) ([1d2b551](https://github.com/setchy/atlassify/commit/1d2b5519ff9c8786cc85e1f153cfd12995b6a2b3))
* **deps-core:** update @tanstack/react-query to v5.105.0 ([#3982](https://github.com/setchy/atlassify/issues/3982)) ([b143561](https://github.com/setchy/atlassify/commit/b1435611c844b956cc9e74c7915b7b7d92dea09c))


### 🧹 Chore

* i18n ally config ([121084f](https://github.com/setchy/atlassify/commit/121084fb63f93293108dbde2656d7e7baba3216c))

## [3.17.1](https://github.com/setchy/atlassify/compare/v3.17.0...v3.17.1) (2026-10-29)


### 🐛 Bug Fixes

* **notifications:** show loading after login with empty inbox ([#3935](https://github.com/setchy/atlassify/issues/3935)) ([8c61f45](https://github.com/setchy/atlassify/commit/8c61f45291f766a663b560f8abebe583bfb5c763))
* pnpm lockfile duplicate ([681125d](https://github.com/setchy/atlassify/commit/681125d6a74851bdea171af4dea896c480d97820))


### 📚 Documentation

* Update Wakatime badge link in README.md ([2fee4a1](https://github.com/setchy/atlassify/commit/2fee4a1091009325f2ff9c314ccdf907dfdbb497))


### 🤖 Continuous Integration

* **labeler:** accept breaking-change markers and broader PR title scopes ([#3971](https://github.com/setchy/atlassify/issues/3971)) ([75c476f](https://github.com/setchy/atlassify/commit/75c476fb223c7a4122f4d640fde5d44d0f414a5c))
* **labeler:** accept breaking-change markers in PR titles ([75c476f](https://github.com/setchy/atlassify/commit/75c476fb223c7a4122f4d640fde5d44d0f414a5c))


### 🧪 Testing

* remove nock in favour of axios mocks ([#3976](https://github.com/setchy/atlassify/issues/3976)) ([b0a4288](https://github.com/setchy/atlassify/commit/b0a4288056eaf5e2a07a75c35f83258fb7de25bc))


### 📦 Dependency Updates (Core)

* **deps-core:** update @atlaskit/avatar to v30.0.5 ([#3926](https://github.com/setchy/atlassify/issues/3926)) ([8a8fd9c](https://github.com/setchy/atlassify/commit/8a8fd9c67ab2398eb980bd713f9b3cc6febfc261))
* **deps-core:** update @atlaskit/avatar-group to v14.4.6 ([#3927](https://github.com/setchy/atlassify/issues/3927)) ([c0066aa](https://github.com/setchy/atlassify/commit/c0066aa47445f3da85b080806bda95175bd4b526))
* **deps-core:** update @atlaskit/button to v25.4.8 ([#3902](https://github.com/setchy/atlassify/issues/3902)) ([d51f9e6](https://github.com/setchy/atlassify/commit/d51f9e61f17c1780b79b27a74752d724e2baa661))
* **deps-core:** update @atlaskit/button to v25.5.0 ([#3931](https://github.com/setchy/atlassify/issues/3931)) ([9098847](https://github.com/setchy/atlassify/commit/9098847e24279f9d3676a13094c24453802e5591))
* **deps-core:** update @atlaskit/button to v25.6.0 ([#3946](https://github.com/setchy/atlassify/issues/3946)) ([87e8249](https://github.com/setchy/atlassify/commit/87e8249c553bb3e4b696bdc617049d85bf7af60f))
* **deps-core:** update @atlaskit/button to v25.6.1 ([#3964](https://github.com/setchy/atlassify/issues/3964)) ([b3b07e1](https://github.com/setchy/atlassify/commit/b3b07e168f571c3123507833d02afd4cb036b4a3))
* **deps-core:** update @atlaskit/css to v1.1.7 ([#3903](https://github.com/setchy/atlassify/issues/3903)) ([28bc259](https://github.com/setchy/atlassify/commit/28bc259895b0909b5b66fcdd730166af6838252c))
* **deps-core:** update @atlaskit/form to v18.2.1 ([#3939](https://github.com/setchy/atlassify/issues/3939)) ([5e5367c](https://github.com/setchy/atlassify/commit/5e5367ca058df519ac580dfa166c957dea988776))
* **deps-core:** update @atlaskit/inline-message to v16.4.8 ([#3928](https://github.com/setchy/atlassify/issues/3928)) ([5b5f65f](https://github.com/setchy/atlassify/commit/5b5f65fb47b3859bc31878fe0562e9c4e65b3a36))
* **deps-core:** update @atlaskit/modal-dialog to v17.1.0 ([#3918](https://github.com/setchy/atlassify/issues/3918)) ([eb7bddd](https://github.com/setchy/atlassify/commit/eb7bddd89211272649c61d8188c5b935f7c539c8))
* **deps-core:** update @atlaskit/modal-dialog to v17.1.1 ([#3940](https://github.com/setchy/atlassify/issues/3940)) ([b9c2a11](https://github.com/setchy/atlassify/commit/b9c2a1130b9e42251fff4d4479bc6bddeb776658))
* **deps-core:** update @atlaskit/primitives to v22.6.0 ([#3911](https://github.com/setchy/atlassify/issues/3911)) ([80b8bc2](https://github.com/setchy/atlassify/commit/80b8bc2213b64626d88e3175b75b624a87da6f1d))
* **deps-core:** update @atlaskit/select to v23.1.3 ([#3904](https://github.com/setchy/atlassify/issues/3904)) ([462cf59](https://github.com/setchy/atlassify/commit/462cf591a8c22818b9af174b4b0ccfe4b3f9ec73))
* **deps-core:** update @atlaskit/tokens to v20.6.1 ([#3912](https://github.com/setchy/atlassify/issues/3912)) ([fd6e323](https://github.com/setchy/atlassify/commit/fd6e323388d764390ae4927d54b1f8259ae80832))
* **deps-core:** update @atlaskit/tokens to v20.7.0 ([#3961](https://github.com/setchy/atlassify/issues/3961)) ([65cc7fa](https://github.com/setchy/atlassify/commit/65cc7fad6396923666c50cfa16526e2d7dfb9913))
* **deps-core:** update @atlaskit/tooltip to v24.4.2 ([#3955](https://github.com/setchy/atlassify/issues/3955)) ([0dd9a53](https://github.com/setchy/atlassify/commit/0dd9a531d5caaae71a027bd10861ab682de62601))
* **deps-core:** update @tanstack/react-query to v5.104.3 ([#3905](https://github.com/setchy/atlassify/issues/3905)) ([60f956d](https://github.com/setchy/atlassify/commit/60f956ddb04a0f921639a827fdc3a6188322cd71))
* **deps-core:** update @tanstack/react-query to v5.104.4 ([#3917](https://github.com/setchy/atlassify/issues/3917)) ([f765b63](https://github.com/setchy/atlassify/commit/f765b63243dd7820e5634f3a5a8efe0d5532305b))
* **deps-core:** update @tanstack/react-query to v5.104.5 ([#3932](https://github.com/setchy/atlassify/issues/3932)) ([43b6bef](https://github.com/setchy/atlassify/commit/43b6bef3661c2ff058066ced895139f7563d1c00))
* **deps-core:** update electron to v44.8.0 ([#3913](https://github.com/setchy/atlassify/issues/3913)) ([2f64f3d](https://github.com/setchy/atlassify/commit/2f64f3d835985a34ae65649758e000a88c35644e))
* **deps-core:** update electron to v44.9.0 ([#3919](https://github.com/setchy/atlassify/issues/3919)) ([fcf8f5a](https://github.com/setchy/atlassify/commit/fcf8f5a14619749a3e34e13be37db91ac2c78ad5))
* **deps-core:** update electron to v44.9.1 [security] ([#3937](https://github.com/setchy/atlassify/issues/3937)) ([01a953b](https://github.com/setchy/atlassify/commit/01a953b5a7dbac4a9539a649754e655d4741e3e2))
* **deps-core:** update electron to v45 ([#3952](https://github.com/setchy/atlassify/issues/3952)) ([64937d6](https://github.com/setchy/atlassify/commit/64937d60672b7c9003879cff6ae3f907cbcd76c5))
* **deps-core:** update electron-menubar to v11.1.2 ([#3936](https://github.com/setchy/atlassify/issues/3936)) ([8cf4463](https://github.com/setchy/atlassify/commit/8cf4463d8824a5aaf3b6e78265bafe21431275c3))
* **deps-core:** update electron-updater to v6.8.11 ([#3942](https://github.com/setchy/atlassify/issues/3942)) ([c2e0d93](https://github.com/setchy/atlassify/commit/c2e0d93f3fff4ab7f8ed010d1ac66af5d3554b68))


### 📦 Dependency Updates (Other)

* **deps:** lock file maintenance ([#3900](https://github.com/setchy/atlassify/issues/3900)) ([4aaf12c](https://github.com/setchy/atlassify/commit/4aaf12c51be6b51bb431a273990aeab639ed548f))
* **deps:** lock file maintenance ([#3916](https://github.com/setchy/atlassify/issues/3916)) ([63688f2](https://github.com/setchy/atlassify/commit/63688f271f918bc79a9e2b2b04cf6b3e658fbf51))
* **deps:** lock file maintenance ([#3924](https://github.com/setchy/atlassify/issues/3924)) ([ffad5ae](https://github.com/setchy/atlassify/commit/ffad5aec95467d193bc06f29bec54b019a9fd335))
* **deps:** lock file maintenance ([#3953](https://github.com/setchy/atlassify/issues/3953)) ([ef55960](https://github.com/setchy/atlassify/commit/ef559606e937a788d431f4b78a5529a57b9b05b8))
* **deps:** lock file maintenance ([#3954](https://github.com/setchy/atlassify/issues/3954)) ([f5eb161](https://github.com/setchy/atlassify/commit/f5eb161ec76c144589d49f98e81d9fff50a4ecbc))
* **deps:** update @biomejs/biome to v2.6.3 ([#3947](https://github.com/setchy/atlassify/issues/3947)) ([0e550bc](https://github.com/setchy/atlassify/commit/0e550bcf850a0042015946d18ce41965916a7ccf))
* **deps:** update @graphql-codegen/typescript-operations to v6.2.0 ([#3974](https://github.com/setchy/atlassify/issues/3974)) ([e4a1664](https://github.com/setchy/atlassify/commit/e4a16646e0fa47be4198159dbe8f75654830ff9a))
* **deps:** update cn to v0.5.0 ([#3920](https://github.com/setchy/atlassify/issues/3920)) ([a6129c4](https://github.com/setchy/atlassify/commit/a6129c4d3ed8210978deb29fb5cbb3ffd930b62b))
* **deps:** update electron-builder to v26.18.0 ([#3948](https://github.com/setchy/atlassify/issues/3948)) ([0efa400](https://github.com/setchy/atlassify/commit/0efa4002b30ee203e4f04da30a16a6bf7555cb1a))
* **deps:** update happy-dom to v21.0.3 ([#3906](https://github.com/setchy/atlassify/issues/3906)) ([efedda1](https://github.com/setchy/atlassify/commit/efedda1004a798166277aa0e8d7695ad6b5ceb4f))
* **deps:** update happy-dom to v21.0.4 [security] ([#3938](https://github.com/setchy/atlassify/issues/3938)) ([5d2eeb0](https://github.com/setchy/atlassify/commit/5d2eeb065052d751d69c7a30f714372498ca39ac))
* **deps:** update i18next to v26.4.7 ([#3907](https://github.com/setchy/atlassify/issues/3907)) ([8f12f5b](https://github.com/setchy/atlassify/commit/8f12f5b91ae8e0d117f17755a0ccfd0ee7597ccf))
* **deps:** update i18next to v26.5.10 ([#3956](https://github.com/setchy/atlassify/issues/3956)) ([5913fa2](https://github.com/setchy/atlassify/commit/5913fa2a610645011c06f4cc3c722826b5f2058d))
* **deps:** update i18next to v26.5.11 ([#3972](https://github.com/setchy/atlassify/issues/3972)) ([5b55985](https://github.com/setchy/atlassify/commit/5b5598587943d48c352e5b2fc7ea36b96d71043c))
* **deps:** update i18next to v26.5.2 ([#3921](https://github.com/setchy/atlassify/issues/3921)) ([ad27a83](https://github.com/setchy/atlassify/commit/ad27a832c92b1e6f325fc4179e940c9d0fbb3f33))
* **deps:** update i18next to v26.5.3 ([#3934](https://github.com/setchy/atlassify/issues/3934)) ([ac1496d](https://github.com/setchy/atlassify/commit/ac1496dbf8888c124b422dce8eb1fa9e0980c84b))
* **deps:** update i18next to v26.5.5 ([#3944](https://github.com/setchy/atlassify/issues/3944)) ([2b68638](https://github.com/setchy/atlassify/commit/2b686381190e14092a2432501f0ec2b1cd657a92))
* **deps:** update i18next-browser-languagedetector to v8.2.3 ([#3957](https://github.com/setchy/atlassify/issues/3957)) ([5da346a](https://github.com/setchy/atlassify/commit/5da346a34512be978530ba2ed9f060b2a730022e))
* **deps:** update i18next-cli to v1.77.0 ([#3922](https://github.com/setchy/atlassify/issues/3922)) ([dad1e07](https://github.com/setchy/atlassify/commit/dad1e07265e316aaff1e0bf8e50f54f1da25c863))
* **deps:** update i18next-cli to v1.79.1 ([#3949](https://github.com/setchy/atlassify/issues/3949)) ([42031f4](https://github.com/setchy/atlassify/commit/42031f47689001807d951cd1181599c4a2a88e5b))
* **deps:** update i18next-cli to v1.80.0 ([#3962](https://github.com/setchy/atlassify/issues/3962)) ([04cb28d](https://github.com/setchy/atlassify/commit/04cb28da6a9514cd6a3b407ee16e1536c28e3d54))
* **deps:** update i18next-cli to v1.80.4 ([#3965](https://github.com/setchy/atlassify/issues/3965)) ([fd8e31c](https://github.com/setchy/atlassify/commit/fd8e31ce03c48734ccbe646ec6649399a300a4b3))
* **deps:** update node to v26 ([#3975](https://github.com/setchy/atlassify/issues/3975)) ([871e141](https://github.com/setchy/atlassify/commit/871e141e70b010a54312a383705b93bdb0fdec0c))
* **deps:** update node.js to v24.22.1 ([#3930](https://github.com/setchy/atlassify/issues/3930)) ([4d06a02](https://github.com/setchy/atlassify/commit/4d06a02a7c042919bcde571ee404d82336daa252))
* **deps:** update pnpm to v12.14.0 ([#3915](https://github.com/setchy/atlassify/issues/3915)) ([a6011c8](https://github.com/setchy/atlassify/commit/a6011c8ad8b72d1f1b350779428b66ed162edf04))
* **deps:** update pnpm to v12.15.0 ([#3950](https://github.com/setchy/atlassify/issues/3950)) ([56416e5](https://github.com/setchy/atlassify/commit/56416e5336d8e7691a5c235f062d4872b6487689))
* **deps:** update pnpm/setup action to v3.1.2 ([#3958](https://github.com/setchy/atlassify/issues/3958)) ([efe9136](https://github.com/setchy/atlassify/commit/efe9136ff21da991e50a45fea4060d4afc516d81))
* **deps:** update react monorepo to v19.3.1 ([#3908](https://github.com/setchy/atlassify/issues/3908)) ([e34d433](https://github.com/setchy/atlassify/commit/e34d4330d18a7040f77bc353c6a6453b34b4757c))
* **deps:** update react-i18next to v17.0.19 ([#3909](https://github.com/setchy/atlassify/issues/3909)) ([7eed1cc](https://github.com/setchy/atlassify/commit/7eed1cc3f37e3cede6b58fb955079b4270d51872))
* **deps:** update react-i18next to v17.1.0 ([#3923](https://github.com/setchy/atlassify/issues/3923)) ([7afe51f](https://github.com/setchy/atlassify/commit/7afe51f62f295ab13ead29a12e90fa638fb82db8))
* **deps:** update react-i18next to v17.1.8 ([#3959](https://github.com/setchy/atlassify/issues/3959)) ([1bad6b7](https://github.com/setchy/atlassify/commit/1bad6b7e31fc51859e140b21f85eccad8495eac6))
* **deps:** update react-i18next to v17.1.9 ([#3973](https://github.com/setchy/atlassify/issues/3973)) ([bc58a7d](https://github.com/setchy/atlassify/commit/bc58a7d09335a62c49822300508b78e252009057))
* **deps:** update sonarsource/sonarqube-scan-action action to v8.4.0 ([#3966](https://github.com/setchy/atlassify/issues/3966)) ([87f6077](https://github.com/setchy/atlassify/commit/87f6077efacba4a78d4a0074c16208678301bfa3))
* **deps:** update vite to v8.3.5 ([#3945](https://github.com/setchy/atlassify/issues/3945)) ([7d7fa62](https://github.com/setchy/atlassify/commit/7d7fa62ecf769e26f47418a3625bf66ee0ecb16f))
* **deps:** update vitest monorepo to v5.0.5 ([#3910](https://github.com/setchy/atlassify/issues/3910)) ([790bc6d](https://github.com/setchy/atlassify/commit/790bc6de393803515508d0bdafdab8b0ffe366ba))
* **deps:** update zizmorcore/zizmor-action action to v0.8.0 ([#3951](https://github.com/setchy/atlassify/issues/3951)) ([6c0a170](https://github.com/setchy/atlassify/commit/6c0a170bdea11fcc0696b60e2d90fef53aba6673))
* **deps:** update zustand to v5.0.16 ([#3960](https://github.com/setchy/atlassify/issues/3960)) ([b02b159](https://github.com/setchy/atlassify/commit/b02b159debe45590a067a037b1de9b60915da6ec))


### 🧹 Chore

* add devEngines Node.js pin ([#3968](https://github.com/setchy/atlassify/issues/3968)) ([5087087](https://github.com/setchy/atlassify/commit/5087087d19885884c14a8577cd9509e8430428ae))
* declare pnpm via devEngines.packageManager ([#3969](https://github.com/setchy/atlassify/issues/3969)) ([f08a068](https://github.com/setchy/atlassify/commit/f08a068528bb47876e5c5ea81357c58e925c9244))
* openspec update 1.15.0 ([9b3a57e](https://github.com/setchy/atlassify/commit/9b3a57ec4cd23dde72586f32409a9ae28610d50f))
* sort devEngines keys ([#3970](https://github.com/setchy/atlassify/issues/3970)) ([c2fddad](https://github.com/setchy/atlassify/commit/c2fddad554066c20032f8aa969bed18ccb2d8de7))

## [3.17.0](https://github.com/setchy/atlassify/compare/v3.16.2...v3.17.0) (2026-10-17)


### 🚀 Features

* update biome domains, rules and associated fixes - [#782](https://github.com/setchy/atlassify/issues/782) ([#3868](https://github.com/setchy/atlassify/issues/3868)) ([1179da8](https://github.com/setchy/atlassify/commit/1179da87309b0a37abc0789eb58c01436f6a77a3))


### 🐛 Bug Fixes

* **renderer:** resolve error catalog strings in the current language ([#3829](https://github.com/setchy/atlassify/issues/3829)) ([661e953](https://github.com/setchy/atlassify/commit/661e953e348feb538b255079819b59a4fbb7059d))
* **renderer:** use useTranslation hook in ManageAccountRoute ([#3828](https://github.com/setchy/atlassify/issues/3828)) ([0a581a9](https://github.com/setchy/atlassify/commit/0a581a9cb6a612ebcd383b7a2dcc5745069b1918))
* **sonar:** resolve floating promises (typescript:S9383) ([#3793](https://github.com/setchy/atlassify/issues/3793)) ([46e7bb4](https://github.com/setchy/atlassify/commit/46e7bb4a480056cd50ff897e276341bbb212b424))
* **sonar:** throw TypeError after type check (typescript:S7786) ([#3795](https://github.com/setchy/atlassify/issues/3795)) ([5fd9fa8](https://github.com/setchy/atlassify/commit/5fd9fa8f9766295d10d0d0c47a80d836a23e7395))


### 🧼 Code Refactoring

* migrate @atlaskit/logo imports to entry points ([#3804](https://github.com/setchy/atlassify/issues/3804)) ([7019402](https://github.com/setchy/atlassify/commit/70194022f6cf3a44470accccbcda2fea96bfedf7))
* migrate to `pnpm/setup` ([#3791](https://github.com/setchy/atlassify/issues/3791)) ([b35cb17](https://github.com/setchy/atlassify/commit/b35cb173ebe36517d187cd82da140d44467f1555))
* **renderer:** use function declarations for React components ([#3869](https://github.com/setchy/atlassify/issues/3869)) ([c7c1f19](https://github.com/setchy/atlassify/commit/c7c1f1999733f119909030f3cd09324011a66484))
* **sonar:** avoid awaiting promises sequentially in loops (typescript:S9382) ([#3794](https://github.com/setchy/atlassify/issues/3794)) ([b7a5651](https://github.com/setchy/atlassify/commit/b7a565177c2e0495ea4e727d781f63136f6fe522))
* **sonar:** hoist unstable icon components (typescript:S6478) ([#3799](https://github.com/setchy/atlassify/issues/3799)) ([e6a8b32](https://github.com/setchy/atlassify/commit/e6a8b32547e44955b64b04cdf57b32a0a19e2d65))
* **sonar:** mark React component props as read-only (typescript:S6759) ([#3888](https://github.com/setchy/atlassify/issues/3888)) ([bc58a4a](https://github.com/setchy/atlassify/commit/bc58a4ad1918fd97aec6258ab200ff43d40adad4))
* **sonar:** remove legacy storage migration (typescript:S1135) ([#3827](https://github.com/setchy/atlassify/issues/3827)) ([e5f93ad](https://github.com/setchy/atlassify/commit/e5f93ad9f7fce5f47a022341d2e00c82fa2051f4))
* **sonar:** resolve async functions without await (typescript:S7503) ([#3796](https://github.com/setchy/atlassify/issues/3796)) ([843fc43](https://github.com/setchy/atlassify/commit/843fc43f6b220d23457bdca77bfa3960de92db96))
* **sonar:** resolve nested ternary in account header styles (typescript:S3358) ([#3800](https://github.com/setchy/atlassify/issues/3800)) ([2d2f83a](https://github.com/setchy/atlassify/commit/2d2f83a63408bc92ab8d547f14bb96d95c803403))
* **sonar:** resolve nested ternary operators (typescript:S3358) ([#3798](https://github.com/setchy/atlassify/issues/3798)) ([91c4c76](https://github.com/setchy/atlassify/commit/91c4c76cc1331f41079fceb8e15350e16ef0800b))
* **sonar:** use non-deprecated avatar size (typescript:S1874) ([#3826](https://github.com/setchy/atlassify/issues/3826)) ([58e31d9](https://github.com/setchy/atlassify/commit/58e31d90f535c9492e7ef42617b24abf5094ae3a))


### 📚 Documentation

* adopt Contributor Covenant 3.0 code of conduct ([#3870](https://github.com/setchy/atlassify/issues/3870)) ([f5cb78a](https://github.com/setchy/atlassify/commit/f5cb78a4092521fca2821a7586a5a7bd79417371))
* enforce Astro checks for website builds and CI ([#3832](https://github.com/setchy/atlassify/issues/3832)) ([198c66a](https://github.com/setchy/atlassify/commit/198c66a1e40b498f0a5157bde3ca00acf56a4b27))
* fix github stats rate limit ([4894a09](https://github.com/setchy/atlassify/commit/4894a09934421fb3e39bdd697a2920d936f05369))


### 🤖 Continuous Integration

* biome ci with github reporter ([febe7c8](https://github.com/setchy/atlassify/commit/febe7c8a8f841bdfe44163fb439807d1766d5505))
* **sonar:** wait for the quality gate before finishing the scan ([#3889](https://github.com/setchy/atlassify/issues/3889)) ([6cf1561](https://github.com/setchy/atlassify/commit/6cf15610f5934bc9fa9623fbc175a0a491205741))
* update milestone and pr comment workflow ([f91fcc6](https://github.com/setchy/atlassify/commit/f91fcc6ab684856e8808b462181ad21251f94f04))


### 🧪 Testing

* **sonar:** parameterize similar tests (typescript:S5976) ([#3797](https://github.com/setchy/atlassify/issues/3797)) ([eeb9b50](https://github.com/setchy/atlassify/commit/eeb9b50f1938c5b66aa68c62cc6c49aa686f252d))


### 📦 Dependency Updates (Core)

* **deps-core:** update @atlaskit/avatar to v29.1.0 ([#3788](https://github.com/setchy/atlassify/issues/3788)) ([5a164d7](https://github.com/setchy/atlassify/commit/5a164d7b539716a59c57b2b56a5f88daf63fba2d))
* **deps-core:** update @atlaskit/avatar to v30 ([#3807](https://github.com/setchy/atlassify/issues/3807)) ([6b87475](https://github.com/setchy/atlassify/commit/6b874758abb5ace83653bf4e835ef969a6c039a8))
* **deps-core:** update @atlaskit/avatar to v30.0.4 ([#3833](https://github.com/setchy/atlassify/issues/3833)) ([11a38f7](https://github.com/setchy/atlassify/commit/11a38f732938eb6e883e5c96e37d2f1950be178f))
* **deps-core:** update @atlaskit/avatar-group to v14.4.0 ([#3789](https://github.com/setchy/atlassify/issues/3789)) ([ee9e52e](https://github.com/setchy/atlassify/commit/ee9e52e0c2566f853d48b5ff76bcc3da75a0d3d3))
* **deps-core:** update @atlaskit/avatar-group to v14.4.4 ([#3810](https://github.com/setchy/atlassify/issues/3810)) ([56cf22c](https://github.com/setchy/atlassify/commit/56cf22c6ac35d1a0186d7d53448c9da0bc016a3b))
* **deps-core:** update @atlaskit/avatar-group to v14.4.5 ([#3871](https://github.com/setchy/atlassify/issues/3871)) ([245445c](https://github.com/setchy/atlassify/commit/245445ca2e9411403b4981c566d07022f6b53471))
* **deps-core:** update @atlaskit/button to v25.4.4 ([#3811](https://github.com/setchy/atlassify/issues/3811)) ([fb4477e](https://github.com/setchy/atlassify/commit/fb4477e1986f522a42ecb0088e4a30631614b779))
* **deps-core:** update @atlaskit/button to v25.4.7 ([#3859](https://github.com/setchy/atlassify/issues/3859)) ([e8540dc](https://github.com/setchy/atlassify/commit/e8540dccffd1e8c3eb1ac12e3aeec73240b1ba9e))
* **deps-core:** update @atlaskit/checkbox to v19.3.0 ([#3844](https://github.com/setchy/atlassify/issues/3844)) ([3b8e45f](https://github.com/setchy/atlassify/commit/3b8e45f622891bf60febdb692060d4cfdc901111))
* **deps-core:** update @atlaskit/checkbox to v19.3.1 ([#3891](https://github.com/setchy/atlassify/issues/3891)) ([52efd24](https://github.com/setchy/atlassify/commit/52efd24acb5c886ff0e10a881746fe6ce3eb06a7))
* **deps-core:** update @atlaskit/form to v18.1.0 ([#3845](https://github.com/setchy/atlassify/issues/3845)) ([8227431](https://github.com/setchy/atlassify/commit/8227431c9f328306d326ac47ddb61ddd7610089b))
* **deps-core:** update @atlaskit/form to v18.2.0 ([#3882](https://github.com/setchy/atlassify/issues/3882)) ([b4770e7](https://github.com/setchy/atlassify/commit/b4770e716d6de11532ee9bce79c48135fb6e4f2f))
* **deps-core:** update @atlaskit/icon to v38.0.2 ([#3812](https://github.com/setchy/atlassify/issues/3812)) ([fd7e21d](https://github.com/setchy/atlassify/commit/fd7e21d463c40e517f7c37099896cf8087391aee))
* **deps-core:** update @atlaskit/icon-lab to v7.11.0 ([#3819](https://github.com/setchy/atlassify/issues/3819)) ([b8c0286](https://github.com/setchy/atlassify/commit/b8c0286d071873e23df063bb427e3a276817ae03))
* **deps-core:** update @atlaskit/inline-message to v16.4.7 ([#3813](https://github.com/setchy/atlassify/issues/3813)) ([20d87cc](https://github.com/setchy/atlassify/commit/20d87cc9865d4c6842ab17fdac08cf746159f725))
* **deps-core:** update @atlaskit/logo to v23.3.1 ([#3802](https://github.com/setchy/atlassify/issues/3802)) ([2ec35b8](https://github.com/setchy/atlassify/commit/2ec35b8315d99e655218d482126235adffe74d62))
* **deps-core:** update @atlaskit/modal-dialog to v17.0.1 ([#3814](https://github.com/setchy/atlassify/issues/3814)) ([3b858fe](https://github.com/setchy/atlassify/commit/3b858fe47a3ea8c01e2aa2b442bd33a89dc5cf6b))
* **deps-core:** update @atlaskit/modal-dialog to v17.0.3 ([#3872](https://github.com/setchy/atlassify/issues/3872)) ([a93a019](https://github.com/setchy/atlassify/commit/a93a01982ff8d16d9ed405445d46f5fe9e672dc7))
* **deps-core:** update @atlaskit/radio to v10.2.5 ([#3834](https://github.com/setchy/atlassify/issues/3834)) ([e09dbf1](https://github.com/setchy/atlassify/commit/e09dbf175b7bdc228106686ba7c47d2c07ee52ca))
* **deps-core:** update @atlaskit/radio to v10.2.6 ([#3892](https://github.com/setchy/atlassify/issues/3892)) ([b64277f](https://github.com/setchy/atlassify/commit/b64277f504b13feb70d3cf87497671a3d01f0940))
* **deps-core:** update @atlaskit/select to v23.1.1 ([#3835](https://github.com/setchy/atlassify/issues/3835)) ([4dd6f78](https://github.com/setchy/atlassify/commit/4dd6f785a4ce268bf68c790bed942de7ecc2311d))
* **deps-core:** update @atlaskit/select to v23.1.2 ([#3873](https://github.com/setchy/atlassify/issues/3873)) ([173eea0](https://github.com/setchy/atlassify/commit/173eea0f2d5c255821b5879904b27f1d8f45573d))
* **deps-core:** update @atlaskit/tag to v17 ([#3808](https://github.com/setchy/atlassify/issues/3808)) ([d71ac9a](https://github.com/setchy/atlassify/commit/d71ac9adca28e73aaaaf83f1d2a87dbf0274f736))
* **deps-core:** update @atlaskit/tag to v17.0.3 ([#3850](https://github.com/setchy/atlassify/issues/3850)) ([15c4e45](https://github.com/setchy/atlassify/commit/15c4e456ea3893ac2f4eec344a9271cd156e54ea))
* **deps-core:** update @atlaskit/tag-group to v13.4.2 ([#3786](https://github.com/setchy/atlassify/issues/3786)) ([92f9fba](https://github.com/setchy/atlassify/commit/92f9fba62d0b607e31e6a7675ea500a84e716e7c))
* **deps-core:** update @atlaskit/toggle to v17.3.5 ([#3893](https://github.com/setchy/atlassify/issues/3893)) ([f544a7c](https://github.com/setchy/atlassify/commit/f544a7c1a02e87bb0fb07b8d922719029b4f39c5))
* **deps-core:** update @atlaskit/tokens to v20.1.0 ([#3820](https://github.com/setchy/atlassify/issues/3820)) ([e3ec983](https://github.com/setchy/atlassify/commit/e3ec983987655f5bc93f664b73a535c7d079e7d7))
* **deps-core:** update @atlaskit/tokens to v20.3.0 ([#3846](https://github.com/setchy/atlassify/issues/3846)) ([39b5ae3](https://github.com/setchy/atlassify/commit/39b5ae30e09a638e43d1d0adeccd876897edca4e))
* **deps-core:** update @atlaskit/tokens to v20.4.1 ([#3883](https://github.com/setchy/atlassify/issues/3883)) ([0b5bbea](https://github.com/setchy/atlassify/commit/0b5bbea2d85d7a212b1404d0474c4bf1f14708e8))
* **deps-core:** update @atlaskit/tokens to v20.5.0 ([#3895](https://github.com/setchy/atlassify/issues/3895)) ([828ac91](https://github.com/setchy/atlassify/commit/828ac919d616f819292cbdeada914fd1036f2e50))
* **deps-core:** update @atlaskit/tooltip to v24.4.0 ([#3821](https://github.com/setchy/atlassify/issues/3821)) ([4202c8c](https://github.com/setchy/atlassify/commit/4202c8c48ea3f2b8e70da750009e8c7d8c49f4ce))
* **deps-core:** update @tanstack/react-query to v5.103.3 ([#3787](https://github.com/setchy/atlassify/issues/3787)) ([11c6a21](https://github.com/setchy/atlassify/commit/11c6a21bbd073c5658aaf565756588f6c1aa26e9))
* **deps-core:** update @tanstack/react-query to v5.104.0 ([#3822](https://github.com/setchy/atlassify/issues/3822)) ([35925c0](https://github.com/setchy/atlassify/commit/35925c093478f924b63ee047d6c3f4a9f24450f1))
* **deps-core:** update @tanstack/react-query to v5.104.1 ([#3836](https://github.com/setchy/atlassify/issues/3836)) ([7e77a57](https://github.com/setchy/atlassify/commit/7e77a573b711e33c532d44e5d748bf48ec25b6c1))
* **deps-core:** update @tanstack/react-query to v5.104.2 ([#3874](https://github.com/setchy/atlassify/issues/3874)) ([8459c8b](https://github.com/setchy/atlassify/commit/8459c8b5a611bf60e740deb568d7e92f0d3b6704))
* **deps-core:** update electron to v44.5.1 ([#3805](https://github.com/setchy/atlassify/issues/3805)) ([2a27439](https://github.com/setchy/atlassify/commit/2a2743945fbc8e313d58e30dec0955fe5c6e8d68))
* **deps-core:** update electron to v44.6.0 ([#3854](https://github.com/setchy/atlassify/issues/3854)) ([3b4e40d](https://github.com/setchy/atlassify/commit/3b4e40dbc26f1b262e9b115f245eb7651a01c6d4))
* **deps-core:** update electron to v44.7.0 ([#3863](https://github.com/setchy/atlassify/issues/3863)) ([fc3a97d](https://github.com/setchy/atlassify/commit/fc3a97dfecc2a2a63d5dd7ae949f2be2169374b9))
* **deps-core:** update electron to v44.7.2 ([#3894](https://github.com/setchy/atlassify/issues/3894)) ([03062f8](https://github.com/setchy/atlassify/commit/03062f8446cc28171766a339dd1445d4bfd4985f))
* **deps-core:** update electron-menubar to v11.1.0 ([#3792](https://github.com/setchy/atlassify/issues/3792)) ([d9ef2f6](https://github.com/setchy/atlassify/commit/d9ef2f6e1f3cc7c083ea452f01f465a335410131))
* **deps-core:** update electron-menubar to v11.1.1 ([#3831](https://github.com/setchy/atlassify/issues/3831)) ([f68f199](https://github.com/setchy/atlassify/commit/f68f1998aa906189e24c15656ef6c802916f55cb))


### 📦 Dependency Updates (Other)

* **deps:** lock file maintenance ([#3825](https://github.com/setchy/atlassify/issues/3825)) ([491f4f0](https://github.com/setchy/atlassify/commit/491f4f06f719b1c1762c2987e8129c1b5b239810))
* **deps:** lock file maintenance ([#3849](https://github.com/setchy/atlassify/issues/3849)) ([c4cf008](https://github.com/setchy/atlassify/commit/c4cf008497b465e05e68ff80af0de611a5bf0a97))
* **deps:** lock file maintenance ([#3897](https://github.com/setchy/atlassify/issues/3897)) ([bc54df2](https://github.com/setchy/atlassify/commit/bc54df26ee500fafb16f52dd3e73fbca9b71a791))
* **deps:** pin pnpm/setup action to v3.0.0 ([#3803](https://github.com/setchy/atlassify/issues/3803)) ([d14c879](https://github.com/setchy/atlassify/commit/d14c879816b0a15b6d4d6498a249c3344c6a2b4d))
* **deps:** remove duplicate react-i18next lockfile entries ([#3862](https://github.com/setchy/atlassify/issues/3862)) ([a8d91d6](https://github.com/setchy/atlassify/commit/a8d91d63141ca66a97e49e7d7e1ae05287860dd3))
* **deps:** update @biomejs/biome to v2.5.15 ([#3815](https://github.com/setchy/atlassify/issues/3815)) ([d3bb050](https://github.com/setchy/atlassify/commit/d3bb050c4a1907e481a7aa3d81ce5f4547b3562d))
* **deps:** update @electron/notarize to v3.1.2 ([#3875](https://github.com/setchy/atlassify/issues/3875)) ([fdc87f7](https://github.com/setchy/atlassify/commit/fdc87f71c6bcc3696ee67604e8f3c2828d5000dc))
* **deps:** update @graphql-codegen/cli to v7.4.6 ([#3876](https://github.com/setchy/atlassify/issues/3876)) ([fed5f2d](https://github.com/setchy/atlassify/commit/fed5f2d48fe501484c1523f7eea770855f4f1f07))
* **deps:** update @graphql-codegen/typescript-operations to v6.1.9 ([#3816](https://github.com/setchy/atlassify/issues/3816)) ([b6f1fde](https://github.com/setchy/atlassify/commit/b6f1fde0254166e780a752b665221ecc57391190))
* **deps:** update @testing-library/user-event to v14.6.8 ([#3877](https://github.com/setchy/atlassify/issues/3877)) ([adfe129](https://github.com/setchy/atlassify/commit/adfe129279968f5ae28a200a16f00438fb079225))
* **deps:** update @types/node to v24.19.0 ([#3790](https://github.com/setchy/atlassify/issues/3790)) ([db6095d](https://github.com/setchy/atlassify/commit/db6095d0e35ffe12e4285a396c6827e24c5fb63e))
* **deps:** update @types/node to v24.19.1 ([#3837](https://github.com/setchy/atlassify/issues/3837)) ([2fa168e](https://github.com/setchy/atlassify/commit/2fa168eff80a4535984a2c2e799e24fb94641190))
* **deps:** update @vitejs/plugin-react to v6.1.2 ([#3838](https://github.com/setchy/atlassify/issues/3838)) ([d742671](https://github.com/setchy/atlassify/commit/d7426716e46e028c778fa5b76ad4ba319e97146a))
* **deps:** update actions/download-artifact action to v8.0.2 ([#3839](https://github.com/setchy/atlassify/issues/3839)) ([2a7d47f](https://github.com/setchy/atlassify/commit/2a7d47fc9ec29b99f6a965b23a2aeb20d18f015f))
* **deps:** update actions/upload-artifact action to v7.0.2 ([#3840](https://github.com/setchy/atlassify/issues/3840)) ([476fc01](https://github.com/setchy/atlassify/commit/476fc014e5fe899063f55db8cfb2af0c565015d1))
* **deps:** update concurrently to v10.0.6 ([#3878](https://github.com/setchy/atlassify/issues/3878)) ([e087bab](https://github.com/setchy/atlassify/commit/e087bab9dbe1fb0429cf436a4c9ebf0d481396a4))
* **deps:** update graphqlcodegenerator monorepo ([#3841](https://github.com/setchy/atlassify/issues/3841)) ([0a594ad](https://github.com/setchy/atlassify/commit/0a594ad562455b28cef0a928a16b1f02bc49297a))
* **deps:** update graphqlcodegenerator monorepo ([#3860](https://github.com/setchy/atlassify/issues/3860)) ([4b71cdf](https://github.com/setchy/atlassify/commit/4b71cdfb8b29c756b7fdc796754668edc0a54ee0))
* **deps:** update happy-dom to v20.14.6 ([#3865](https://github.com/setchy/atlassify/issues/3865)) ([1785ff6](https://github.com/setchy/atlassify/commit/1785ff650b396cf99f6352986c0e2a5e7c44d20b))
* **deps:** update happy-dom to v21 ([#3887](https://github.com/setchy/atlassify/issues/3887)) ([0409a0c](https://github.com/setchy/atlassify/commit/0409a0c4cc68d86791657db4e351ec3bc16c06e1))
* **deps:** update i18next to v26.4.4 ([#3879](https://github.com/setchy/atlassify/issues/3879)) ([6292c47](https://github.com/setchy/atlassify/commit/6292c47d84dda3278953eec9941105aafe951dec))
* **deps:** update i18next-cli to v1.74.4 ([#3817](https://github.com/setchy/atlassify/issues/3817)) ([c43d403](https://github.com/setchy/atlassify/commit/c43d403da2de961f17df35125c085a150dbd1eb5))
* **deps:** update i18next-cli to v1.74.6 ([#3842](https://github.com/setchy/atlassify/issues/3842)) ([a75e756](https://github.com/setchy/atlassify/commit/a75e7560cc66431e20ea4d38b79942da728659aa))
* **deps:** update i18next-cli to v1.74.8 ([#3852](https://github.com/setchy/atlassify/issues/3852)) ([33ff3d4](https://github.com/setchy/atlassify/commit/33ff3d459f68e8c86a4e887c77b656e684d0064c))
* **deps:** update i18next-cli to v1.75.0 ([#3861](https://github.com/setchy/atlassify/issues/3861)) ([3ba8616](https://github.com/setchy/atlassify/commit/3ba86161f77efebb41797677c19246bdce60d12b))
* **deps:** update i18next-cli to v1.75.3 ([#3880](https://github.com/setchy/atlassify/issues/3880)) ([9b6ac7f](https://github.com/setchy/atlassify/commit/9b6ac7fbefd649ecb2d40e4b785d53fcd930a392))
* **deps:** update node.js to v24.22.0 ([#3884](https://github.com/setchy/atlassify/issues/3884)) ([d32bcc2](https://github.com/setchy/atlassify/commit/d32bcc2c61852fa993af9ba8e8a95dfa456ea2a6))
* **deps:** update pnpm to v12.10.1 ([#3855](https://github.com/setchy/atlassify/issues/3855)) ([fafe4c8](https://github.com/setchy/atlassify/commit/fafe4c8d855f429d31f6a3e5e7625c51ba7df940))
* **deps:** update pnpm to v12.11.2 ([#3885](https://github.com/setchy/atlassify/issues/3885)) ([9cade2f](https://github.com/setchy/atlassify/commit/9cade2fb73618dfb49080ecb92dc9cd92a14c5ad))
* **deps:** update pnpm to v12.13.0 ([#3896](https://github.com/setchy/atlassify/issues/3896)) ([f18ae55](https://github.com/setchy/atlassify/commit/f18ae5525cfa2345503bd8220ffa877f26929c33))
* **deps:** update pnpm to v12.8.2 ([#3806](https://github.com/setchy/atlassify/issues/3806)) ([7281604](https://github.com/setchy/atlassify/commit/728160442a835c87d4c7047b3cc5424b27df1680))
* **deps:** update pnpm to v12.9.1 ([#3848](https://github.com/setchy/atlassify/issues/3848)) ([8aaf9d4](https://github.com/setchy/atlassify/commit/8aaf9d4f7add5bedd230e879034811634b2edffc))
* **deps:** update pnpm/setup action to v3.1.1 ([#3867](https://github.com/setchy/atlassify/issues/3867)) ([cfbca2a](https://github.com/setchy/atlassify/commit/cfbca2a2aeb590896a5f7acb0b41e7bfbeca2dbf))
* **deps:** update react-i18next to v17.0.16 ([#3853](https://github.com/setchy/atlassify/issues/3853)) ([3702f8c](https://github.com/setchy/atlassify/commit/3702f8caeb5d7570e30b43d3869d58f53fc1960f))
* **deps:** update sonarsource/sonarqube-scan-action action to v8.3.0 ([#3809](https://github.com/setchy/atlassify/issues/3809)) ([795a498](https://github.com/setchy/atlassify/commit/795a49851059d4e8b1ea80f130972380de9a267a))
* **deps:** update vite to v8.3.2 ([#3823](https://github.com/setchy/atlassify/issues/3823)) ([025bc13](https://github.com/setchy/atlassify/commit/025bc137086c2df168f6aeeeac7e7cff229a88e9))
* **deps:** update vite to v8.3.3 ([#3843](https://github.com/setchy/atlassify/issues/3843)) ([ad12d18](https://github.com/setchy/atlassify/commit/ad12d181bc5fd631f8ff29b5712c5fd5ca9441b1))
* **deps:** update vite to v8.3.4 ([#3866](https://github.com/setchy/atlassify/issues/3866)) ([c648e8e](https://github.com/setchy/atlassify/commit/c648e8ef7c6d2e4eadcd294194567cb9478268d7))
* **deps:** update vitest monorepo to v5.0.2 ([#3784](https://github.com/setchy/atlassify/issues/3784)) ([092a31e](https://github.com/setchy/atlassify/commit/092a31e351ee0535954a0fed3bc2922ee8bf4e8f))
* **deps:** update vitest monorepo to v5.0.3 ([#3824](https://github.com/setchy/atlassify/issues/3824)) ([268be8b](https://github.com/setchy/atlassify/commit/268be8b54ec9c8fe26cd761e5c9e06846f443bcc))
* **deps:** update vitest monorepo to v5.0.4 ([#3881](https://github.com/setchy/atlassify/issues/3881)) ([c3be662](https://github.com/setchy/atlassify/commit/c3be662681299b99205594fdfb47d4b80ee84eb3))
* **deps:** update zizmorcore/zizmor-action action to v0.7.1 ([#3886](https://github.com/setchy/atlassify/issues/3886)) ([9807d5b](https://github.com/setchy/atlassify/commit/9807d5b040b2f28465da3c615cc9bd1c2b2b856a))


### 🧹 Chore

* lockfile update and snapshots ([f132156](https://github.com/setchy/atlassify/commit/f132156bb3cb1e8669441de1a006deb1b7943ff6))
* openspec update ([73df6ad](https://github.com/setchy/atlassify/commit/73df6add29d65859100c4370537e6e2533cc1488))
* **openspec:** adopt the atlassify-specs store ([#3890](https://github.com/setchy/atlassify/issues/3890)) ([9874965](https://github.com/setchy/atlassify/commit/9874965f53d0088a4b711da5f10e249bb0d692fa))
* remove app-builder-lib patch ([#3801](https://github.com/setchy/atlassify/issues/3801)) ([a3339df](https://github.com/setchy/atlassify/commit/a3339dfe5a406ad45add7953dd389504da087de4))
* update gitignore for openspec ([6c50ad6](https://github.com/setchy/atlassify/commit/6c50ad6a7e76db62bc1b74ff950482c4e06b6c3b))
* use shared renovate-config preset ([#3858](https://github.com/setchy/atlassify/issues/3858)) ([466e95e](https://github.com/setchy/atlassify/commit/466e95e95e71513c79edc2d2b73ad33d17774baf))

## [3.16.2](https://github.com/setchy/atlassify/compare/v3.16.1...v3.16.2) (2026-09-28)


### 🐛 Bug Fixes

* release milestone steps ([102a193](https://github.com/setchy/atlassify/commit/102a19364c2c8a4fbbd755e99c7dd9b4a1769d72))


### 📦 Dependency Updates (Core)

* **deps-core:** update @atlaskit/avatar to v28.0.3 ([#3699](https://github.com/setchy/atlassify/issues/3699)) ([b78892c](https://github.com/setchy/atlassify/commit/b78892c30f828efce5e25d3f3c1abf91a4eac51f))
* **deps-core:** update @atlaskit/avatar to v28.0.4 ([#3744](https://github.com/setchy/atlassify/issues/3744)) ([24c349a](https://github.com/setchy/atlassify/commit/24c349ad43addddf7f509534e92599fe6cb2ba65))
* **deps-core:** update @atlaskit/avatar to v29 ([#3768](https://github.com/setchy/atlassify/issues/3768)) ([f4e2260](https://github.com/setchy/atlassify/commit/f4e2260e200de754fc53b57654a846c22bde155e))
* **deps-core:** update @atlaskit/avatar-group to v14.3.7 ([#3700](https://github.com/setchy/atlassify/issues/3700)) ([752cd80](https://github.com/setchy/atlassify/commit/752cd80385cd2419597bd225c3c8913d1971b93a))
* **deps-core:** update @atlaskit/avatar-group to v14.3.9 ([#3745](https://github.com/setchy/atlassify/issues/3745)) ([2310443](https://github.com/setchy/atlassify/commit/231044386aa08cb97fa454570075a1f1ed45cbef))
* **deps-core:** update @atlaskit/badge to v21.2.2 ([#3701](https://github.com/setchy/atlassify/issues/3701)) ([7cb48d3](https://github.com/setchy/atlassify/commit/7cb48d366c30ec6b82398fc7c52b94ce08bf9adf))
* **deps-core:** update @atlaskit/badge to v22 ([#3778](https://github.com/setchy/atlassify/issues/3778)) ([fb28631](https://github.com/setchy/atlassify/commit/fb2863121428250d7108441c0c6ba710ce7688e3))
* **deps-core:** update @atlaskit/button to v25.3.5 ([#3702](https://github.com/setchy/atlassify/issues/3702)) ([8d3e16a](https://github.com/setchy/atlassify/commit/8d3e16a9f4311c308d087ad7c86a835ee043c376))
* **deps-core:** update @atlaskit/button to v25.4.0 ([#3737](https://github.com/setchy/atlassify/issues/3737)) ([6775ea9](https://github.com/setchy/atlassify/commit/6775ea937afe8f99f0ffd4c15218ff8fd0bb281b))
* **deps-core:** update @atlaskit/button to v25.4.2 ([#3747](https://github.com/setchy/atlassify/issues/3747)) ([a4d2e83](https://github.com/setchy/atlassify/commit/a4d2e83b818021af33c49a7bc451823674c1656c))
* **deps-core:** update @atlaskit/checkbox to v19.2.2 ([#3703](https://github.com/setchy/atlassify/issues/3703)) ([7bf905f](https://github.com/setchy/atlassify/commit/7bf905f3d09ac4a32d6486b92f35f5aee7e908a4))
* **deps-core:** update @atlaskit/checkbox to v19.2.4 ([#3748](https://github.com/setchy/atlassify/issues/3748)) ([82045e7](https://github.com/setchy/atlassify/commit/82045e7eba4606d71972ecac335f519b872e7241))
* **deps-core:** update @atlaskit/css to v1.1.4 ([#3704](https://github.com/setchy/atlassify/issues/3704)) ([c961428](https://github.com/setchy/atlassify/commit/c961428bcd51c82105cb50c82625f13097b56227))
* **deps-core:** update @atlaskit/css to v1.1.6 ([#3749](https://github.com/setchy/atlassify/issues/3749)) ([059195e](https://github.com/setchy/atlassify/commit/059195e8d6a5af108d26e3f275ac53b5912b96b4))
* **deps-core:** update @atlaskit/css-reset to v8.4.4 ([#3705](https://github.com/setchy/atlassify/issues/3705)) ([6c3479e](https://github.com/setchy/atlassify/commit/6c3479e0af4ab2110d847447d3555544f65590b7))
* **deps-core:** update @atlaskit/css-reset to v8.4.6 ([#3750](https://github.com/setchy/atlassify/issues/3750)) ([7abe757](https://github.com/setchy/atlassify/commit/7abe7576ffd1e8e5e5a8455518bc11d21f15ca38))
* **deps-core:** update @atlaskit/form to v17.2.2 ([#3706](https://github.com/setchy/atlassify/issues/3706)) ([c1743b4](https://github.com/setchy/atlassify/commit/c1743b4fff05a8d06a03484bf66649df47e1cad6))
* **deps-core:** update @atlaskit/form to v18 ([#3769](https://github.com/setchy/atlassify/issues/3769)) ([0feaae0](https://github.com/setchy/atlassify/commit/0feaae003da0b57d9c07fb0dad6d4b96b10ef7cb))
* **deps-core:** update @atlaskit/heading to v7.2.2 ([#3707](https://github.com/setchy/atlassify/issues/3707)) ([bed7832](https://github.com/setchy/atlassify/commit/bed78326562d1adc57736c894142aabfbfb67f52))
* **deps-core:** update @atlaskit/heading to v8 ([#3770](https://github.com/setchy/atlassify/issues/3770)) ([d71889b](https://github.com/setchy/atlassify/commit/d71889b0b107f81f2e832596c2f168a79f98862f))
* **deps-core:** update @atlaskit/icon to v37.7.2 ([#3708](https://github.com/setchy/atlassify/issues/3708)) ([020188d](https://github.com/setchy/atlassify/commit/020188d0a55c5365dd8a0a109e8e15be4d3cbc31))
* **deps-core:** update @atlaskit/icon to v38 ([#3771](https://github.com/setchy/atlassify/issues/3771)) ([624d46a](https://github.com/setchy/atlassify/commit/624d46a727590fd0e2c8f2d79c6e0ab49cf4f6b3))
* **deps-core:** update @atlaskit/icon-lab to v7.10.0 ([#3782](https://github.com/setchy/atlassify/issues/3782)) ([9f608ab](https://github.com/setchy/atlassify/commit/9f608aba488f83ed87ac11a4a331511a06320365))
* **deps-core:** update @atlaskit/icon-lab to v7.9.1 ([#3754](https://github.com/setchy/atlassify/issues/3754)) ([982de57](https://github.com/setchy/atlassify/commit/982de57fc65a9fdb5e6136b58e3d8872994c610b))
* **deps-core:** update @atlaskit/inline-message to v16.4.2 ([#3709](https://github.com/setchy/atlassify/issues/3709)) ([f9dee56](https://github.com/setchy/atlassify/commit/f9dee562d0ba0b4829a94ee65ece5804336eb334))
* **deps-core:** update @atlaskit/inline-message to v16.4.4 ([#3755](https://github.com/setchy/atlassify/issues/3755)) ([4ea7d46](https://github.com/setchy/atlassify/commit/4ea7d461d355dfc10737de4f9e56527239bc8da7))
* **deps-core:** update @atlaskit/logo to v23.0.2 ([#3710](https://github.com/setchy/atlassify/issues/3710)) ([75f44d5](https://github.com/setchy/atlassify/commit/75f44d53895655785e27e29111905b719ade14c2))
* **deps-core:** update @atlaskit/logo to v23.1.0 ([#3730](https://github.com/setchy/atlassify/issues/3730)) ([28f556e](https://github.com/setchy/atlassify/commit/28f556e5fbf6b7cb0d7e9ab8972304d342d8b4fd))
* **deps-core:** update @atlaskit/logo to v23.2.0 ([#3756](https://github.com/setchy/atlassify/issues/3756)) ([d1cf660](https://github.com/setchy/atlassify/commit/d1cf660af2e4c4fdb7eea9a0fe783cd010396721))
* **deps-core:** update @atlaskit/logo to v23.3.0 ([#3781](https://github.com/setchy/atlassify/issues/3781)) ([4ea064b](https://github.com/setchy/atlassify/commit/4ea064bfd6f3baed0f77259b5985115642c8431c))
* **deps-core:** update @atlaskit/modal-dialog to v16.6.6 ([#3711](https://github.com/setchy/atlassify/issues/3711)) ([c09e6f0](https://github.com/setchy/atlassify/commit/c09e6f0696a0b39a61840c960232b4595a8074d2))
* **deps-core:** update @atlaskit/modal-dialog to v17 ([#3772](https://github.com/setchy/atlassify/issues/3772)) ([1b434d2](https://github.com/setchy/atlassify/commit/1b434d244e32926e18705f8100e5d6301dd3d912))
* **deps-core:** update @atlaskit/primitives to v22.5.2 ([#3712](https://github.com/setchy/atlassify/issues/3712)) ([415bdc6](https://github.com/setchy/atlassify/commit/415bdc6359ec46d2533e4aa40995ce17241e9442))
* **deps-core:** update @atlaskit/primitives to v22.5.4 ([#3758](https://github.com/setchy/atlassify/issues/3758)) ([af8e6ac](https://github.com/setchy/atlassify/commit/af8e6acc1c8c8cd527e0b34b0d3e206b6bb85d0f))
* **deps-core:** update @atlaskit/radio to v10.2.2 ([#3713](https://github.com/setchy/atlassify/issues/3713)) ([7e7fca6](https://github.com/setchy/atlassify/commit/7e7fca6b05f40d7467aed511988755ef5d5f335c))
* **deps-core:** update @atlaskit/radio to v10.2.4 ([#3759](https://github.com/setchy/atlassify/issues/3759)) ([82b564f](https://github.com/setchy/atlassify/commit/82b564feaddafc2a96c59400ba1fcba1ce905a24))
* **deps-core:** update @atlaskit/select to v22.11.6 ([#3714](https://github.com/setchy/atlassify/issues/3714)) ([dffd04f](https://github.com/setchy/atlassify/commit/dffd04f5970dbc8647685969b9d48eed0a425821))
* **deps-core:** update @atlaskit/select to v23 ([#3773](https://github.com/setchy/atlassify/issues/3773)) ([d12758a](https://github.com/setchy/atlassify/commit/d12758aac6007ae6f7d4d503a572746ce814f7d1))
* **deps-core:** update @atlaskit/spinner to v20.4.2 ([#3715](https://github.com/setchy/atlassify/issues/3715)) ([bc28a4d](https://github.com/setchy/atlassify/commit/bc28a4d16a4098acd67b4d6b79cf78b2f36670a6))
* **deps-core:** update @atlaskit/spinner to v20.4.4 ([#3761](https://github.com/setchy/atlassify/issues/3761)) ([0897f5b](https://github.com/setchy/atlassify/commit/0897f5bc125e35afe9766c99acdfd02511ad0f4c))
* **deps-core:** update @atlaskit/tag to v15.8.4 ([#3716](https://github.com/setchy/atlassify/issues/3716)) ([4607ada](https://github.com/setchy/atlassify/commit/4607adaee53cf536a90dbab458998ac366513b39))
* **deps-core:** update @atlaskit/tag to v16 ([#3774](https://github.com/setchy/atlassify/issues/3774)) ([a85a2c0](https://github.com/setchy/atlassify/commit/a85a2c072dc61622a242a1950bb34a1a22267ac6))
* **deps-core:** update @atlaskit/tag-group to v13.4.1 ([#3763](https://github.com/setchy/atlassify/issues/3763)) ([a38d02b](https://github.com/setchy/atlassify/commit/a38d02bfba30051a963cdde929bf2249ebe4c227))
* **deps-core:** update @atlaskit/textfield to v10.2.4 ([#3717](https://github.com/setchy/atlassify/issues/3717)) ([abcb7bc](https://github.com/setchy/atlassify/commit/abcb7bc4fcc16d0e04ade38a85b66013ac4f82bc))
* **deps-core:** update @atlaskit/textfield to v10.2.6 ([#3764](https://github.com/setchy/atlassify/issues/3764)) ([871b4bc](https://github.com/setchy/atlassify/commit/871b4bc563d30233c5e3cf81a9240d57d068d327))
* **deps-core:** update @atlaskit/toggle to v17.3.2 ([#3718](https://github.com/setchy/atlassify/issues/3718)) ([767e9d7](https://github.com/setchy/atlassify/commit/767e9d70d9c45075b5a2732c3176abce45c37ffb))
* **deps-core:** update @atlaskit/toggle to v17.3.4 ([#3765](https://github.com/setchy/atlassify/issues/3765)) ([bfa277c](https://github.com/setchy/atlassify/commit/bfa277caa05b6470ecff9da8af953b8870221a29))
* **deps-core:** update @atlaskit/tokens to v18 ([#3725](https://github.com/setchy/atlassify/issues/3725)) ([2531287](https://github.com/setchy/atlassify/commit/2531287023a52fa64ba8c8451b6821cc0b1eb08c))
* **deps-core:** update @atlaskit/tokens to v18.2.1 ([#3732](https://github.com/setchy/atlassify/issues/3732)) ([44e5d82](https://github.com/setchy/atlassify/commit/44e5d82e901f13fcf2a8bf4b958de2a4e1500805))
* **deps-core:** update @atlaskit/tokens to v18.3.0 ([#3742](https://github.com/setchy/atlassify/issues/3742)) ([567f6a8](https://github.com/setchy/atlassify/commit/567f6a8154c7671bef19356a20cb708f60494f8f))
* **deps-core:** update @atlaskit/tokens to v20 ([#3776](https://github.com/setchy/atlassify/issues/3776)) ([6d4d29d](https://github.com/setchy/atlassify/commit/6d4d29dbf9b62c4615b003662bdba12388050ac0))
* **deps-core:** update @atlaskit/tooltip to v24.3.4 ([#3720](https://github.com/setchy/atlassify/issues/3720)) ([126b8f1](https://github.com/setchy/atlassify/commit/126b8f1645ce863d01a33f45623face8500474dd))
* **deps-core:** update @atlaskit/tooltip to v24.3.6 ([#3766](https://github.com/setchy/atlassify/issues/3766)) ([1114610](https://github.com/setchy/atlassify/commit/1114610faf0695f6097b19e34e603efb9d0eb638))
* **deps-core:** update @tanstack/react-query to v5.103.1 ([#3721](https://github.com/setchy/atlassify/issues/3721)) ([ad22812](https://github.com/setchy/atlassify/commit/ad22812203dd6f916d2614e0b1ef218b710964d2))
* **deps-core:** update @tanstack/react-query to v5.103.2 ([#3733](https://github.com/setchy/atlassify/issues/3733)) ([22015de](https://github.com/setchy/atlassify/commit/22015def7889b27a0448bde04f32d49e99ae74bd))
* **deps-core:** update electron to v44.4.2 ([#3727](https://github.com/setchy/atlassify/issues/3727)) ([93e9531](https://github.com/setchy/atlassify/commit/93e9531ecfea3d4022aa6993794104b90f78ce60))
* **deps-core:** update electron to v44.4.3 ([#3728](https://github.com/setchy/atlassify/issues/3728)) ([39cc8eb](https://github.com/setchy/atlassify/commit/39cc8eb18a17a9824a00f5d69d98074fa261fab9))
* **deps-core:** update electron to v44.4.4 ([#3740](https://github.com/setchy/atlassify/issues/3740)) ([56dc93e](https://github.com/setchy/atlassify/commit/56dc93e4fea1a11b1b6a243ef1cea89faf855574))
* **deps-core:** update electron to v44.4.5 ([#3767](https://github.com/setchy/atlassify/issues/3767)) ([b1561e2](https://github.com/setchy/atlassify/commit/b1561e2cf2180c1992eba6d01bfa7d1402ae3bc9))


### 📦 Dependency Updates (Other)

* **deps:** lock file maintenance ([#3726](https://github.com/setchy/atlassify/issues/3726)) ([3aa5883](https://github.com/setchy/atlassify/commit/3aa5883e99f29c9e6a3f1530d0d4e10f17564e61))
* **deps:** lock file maintenance ([#3783](https://github.com/setchy/atlassify/issues/3783)) ([7cf264f](https://github.com/setchy/atlassify/commit/7cf264f163ea1a2fb9f9e1c937dad5728112c76c))
* **deps:** update @compiled/vite-plugin to v2.0.4 ([#3722](https://github.com/setchy/atlassify/issues/3722)) ([9c6e349](https://github.com/setchy/atlassify/commit/9c6e349f96ce7d7e4ed312a874d5f381177c0bb4))
* **deps:** update @graphql-codegen/cli to v7.4.3 ([#3779](https://github.com/setchy/atlassify/issues/3779)) ([41fa7e0](https://github.com/setchy/atlassify/commit/41fa7e0e57d4dfea793cb393a719efb445218184))
* **deps:** update @types/node to v24.13.6 ([#3729](https://github.com/setchy/atlassify/issues/3729)) ([2e32ff5](https://github.com/setchy/atlassify/commit/2e32ff5e26e75f732797877a3c6ae2ded40bd95b))
* **deps:** update cn to v0.3.2 ([#3734](https://github.com/setchy/atlassify/issues/3734)) ([a258123](https://github.com/setchy/atlassify/commit/a258123de7cdb728494b37b8c40c210b497ca84d))
* **deps:** update cn to v0.4.0 ([#3739](https://github.com/setchy/atlassify/issues/3739)) ([f3de786](https://github.com/setchy/atlassify/commit/f3de7869558083c47755e9af6c039aa001ddbc4d))
* **deps:** update graphqlcodegenerator monorepo ([#3735](https://github.com/setchy/atlassify/issues/3735)) ([d9a1bea](https://github.com/setchy/atlassify/commit/d9a1beafad09aa93f487c4aaec94763a287f1ba6))
* **deps:** update i18next-cli to v1.74.1 ([#3724](https://github.com/setchy/atlassify/issues/3724)) ([e5dab92](https://github.com/setchy/atlassify/commit/e5dab92e3d1fe46b759a2062eaf3215af7702ee0))
* **deps:** update pnpm to v12.5.1 ([#3731](https://github.com/setchy/atlassify/issues/3731)) ([1e22cfa](https://github.com/setchy/atlassify/commit/1e22cfa3aa8c5a00481f027c98d5d09d3e96cf1a))
* **deps:** update pnpm to v12.6.0 ([#3743](https://github.com/setchy/atlassify/issues/3743)) ([0028771](https://github.com/setchy/atlassify/commit/0028771946a0ff435116e4d348ad3c05cc0e4c08))
* **deps:** update react-i18next to v17.0.15 ([#3736](https://github.com/setchy/atlassify/issues/3736)) ([5639bd6](https://github.com/setchy/atlassify/commit/5639bd6e7b28d4914018f9007ed69acfaaa457ce))
* **deps:** update vite to v8.3.1 ([#3780](https://github.com/setchy/atlassify/issues/3780)) ([8e15733](https://github.com/setchy/atlassify/commit/8e157330bbf2290944436069706d7aa6d9961612))

## [3.16.1](https://github.com/setchy/atlassify/compare/v3.16.0...v3.16.1) (2026-09-19)


### 🐛 Bug Fixes

* macos signing patch ([7b84aa5](https://github.com/setchy/atlassify/commit/7b84aa5610904625d6926e8f692baa8efcc5a643))
* macos signing patch ([98a1ffc](https://github.com/setchy/atlassify/commit/98a1ffcab89546f2a6807da1addabbf3489ff54b))
* release commenter ([bedd826](https://github.com/setchy/atlassify/commit/bedd826e3b3fb9b91acad528089c04524d128868))
* release commenter ([d74e8ca](https://github.com/setchy/atlassify/commit/d74e8ca98acec38f62d8386883b1dda3406822a6))


### 📦 Dependency Updates (Core)

* **deps-core:** update @atlaskit/avatar to v28.0.2 ([#3668](https://github.com/setchy/atlassify/issues/3668)) ([89862cb](https://github.com/setchy/atlassify/commit/89862cb1f4088282356392d8bc7559e357beae4e))
* **deps-core:** update @atlaskit/avatar-group to v14.3.5 ([#3669](https://github.com/setchy/atlassify/issues/3669)) ([1bd9d32](https://github.com/setchy/atlassify/commit/1bd9d32045760e21ad47fb15920e150a3ecbe772))
* **deps-core:** update @atlaskit/badge to v21.2.1 ([#3670](https://github.com/setchy/atlassify/issues/3670)) ([89a970c](https://github.com/setchy/atlassify/commit/89a970cc2b8228b2a20671897bee14dba040d757))
* **deps-core:** update @atlaskit/button to v25.3.4 ([#3671](https://github.com/setchy/atlassify/issues/3671)) ([a0c6f1a](https://github.com/setchy/atlassify/commit/a0c6f1ab9cb9d20c7946cc5a816ab5e1da8d5459))
* **deps-core:** update @atlaskit/checkbox to v19.2.1 ([#3672](https://github.com/setchy/atlassify/issues/3672)) ([4259476](https://github.com/setchy/atlassify/commit/4259476fbf60ff83bc3823f0c47e7491c59254c0))
* **deps-core:** update @atlaskit/css to v1.1.3 ([#3673](https://github.com/setchy/atlassify/issues/3673)) ([146ddf6](https://github.com/setchy/atlassify/commit/146ddf6de69d5062d3a5bd5951f825cef874b6c0))
* **deps-core:** update @atlaskit/css-reset to v8.4.3 ([#3674](https://github.com/setchy/atlassify/issues/3674)) ([2986728](https://github.com/setchy/atlassify/commit/298672816c68865e25f84e3e74a7ece961728104))
* **deps-core:** update @atlaskit/form to v17.2.1 ([#3675](https://github.com/setchy/atlassify/issues/3675)) ([1e67f3e](https://github.com/setchy/atlassify/commit/1e67f3e5e7baf761885f3e881fa0715516b7b079))
* **deps-core:** update @atlaskit/heading to v7.2.1 ([#3676](https://github.com/setchy/atlassify/issues/3676)) ([a21295b](https://github.com/setchy/atlassify/commit/a21295bed7d23d72666f7a118c5ca17c2e72d456))
* **deps-core:** update @atlaskit/icon to v37.7.1 ([#3666](https://github.com/setchy/atlassify/issues/3666)) ([298596f](https://github.com/setchy/atlassify/commit/298596f851ab3527cf22ba5a3fe54486fd6b009d))
* **deps-core:** update @atlaskit/icon-lab to v7.9.0 ([#3667](https://github.com/setchy/atlassify/issues/3667)) ([e1c8a02](https://github.com/setchy/atlassify/commit/e1c8a025e1528566ccb12d99282a0fe1878922e0))
* **deps-core:** update @atlaskit/inline-message to v16.4.1 ([#3677](https://github.com/setchy/atlassify/issues/3677)) ([0b64d29](https://github.com/setchy/atlassify/commit/0b64d29e04e9abbdd7f7d3e879bd3a8df9adac43))
* **deps-core:** update @atlaskit/logo to v23.0.1 ([#3678](https://github.com/setchy/atlassify/issues/3678)) ([19d2289](https://github.com/setchy/atlassify/commit/19d2289690238f23a1f7281c739a731ec8a4d453))
* **deps-core:** update @atlaskit/modal-dialog to v16.6.5 ([#3679](https://github.com/setchy/atlassify/issues/3679)) ([c85f5ce](https://github.com/setchy/atlassify/commit/c85f5ce7f2997a99cafb0e18d17871bff674ef0d))
* **deps-core:** update @atlaskit/primitives to v22.5.1 ([#3680](https://github.com/setchy/atlassify/issues/3680)) ([c1a58ca](https://github.com/setchy/atlassify/commit/c1a58cad998b93c98f4179790a970fc7f998d511))
* **deps-core:** update @atlaskit/radio to v10.2.1 ([#3681](https://github.com/setchy/atlassify/issues/3681)) ([a2ec3fd](https://github.com/setchy/atlassify/commit/a2ec3fd7019f6fca618ac9c706da1d54bd4bd5a6))
* **deps-core:** update @atlaskit/select to v22.11.5 ([#3682](https://github.com/setchy/atlassify/issues/3682)) ([fd6f6e0](https://github.com/setchy/atlassify/commit/fd6f6e09d8dcb3f62f3b470331f70d42f31df7a8))
* **deps-core:** update @atlaskit/spinner to v20.4.1 ([#3683](https://github.com/setchy/atlassify/issues/3683)) ([43c1a02](https://github.com/setchy/atlassify/commit/43c1a02e7c5379895388f3a790dfe7cf940517ea))
* **deps-core:** update @atlaskit/tag to v15.8.2 ([#3684](https://github.com/setchy/atlassify/issues/3684)) ([1c9172d](https://github.com/setchy/atlassify/commit/1c9172dc815097366e90ca5b808d0d17562be4b8))
* **deps-core:** update @atlaskit/textfield to v10.2.3 ([#3685](https://github.com/setchy/atlassify/issues/3685)) ([8bf5602](https://github.com/setchy/atlassify/commit/8bf56028c431cb175776f29572420388393a8577))
* **deps-core:** update @atlaskit/toggle to v17.3.1 ([#3686](https://github.com/setchy/atlassify/issues/3686)) ([a3a0535](https://github.com/setchy/atlassify/commit/a3a0535d7e1cca0f0a1d291eb32f2ce3a5d7abf8))
* **deps-core:** update @atlaskit/tokens to v17 ([#3693](https://github.com/setchy/atlassify/issues/3693)) ([92d21a5](https://github.com/setchy/atlassify/commit/92d21a569a493cdc3ed205a0714fc7a7a4df073f))
* **deps-core:** update @atlaskit/tooltip to v24.3.3 ([#3687](https://github.com/setchy/atlassify/issues/3687)) ([bad32c3](https://github.com/setchy/atlassify/commit/bad32c33c3531fce2914ac6c47ae17dc2387721b))
* **deps-core:** update @tanstack/react-query to v5.103.0 ([#3695](https://github.com/setchy/atlassify/issues/3695)) ([0c20d63](https://github.com/setchy/atlassify/commit/0c20d637c150ecf032ac8359d5c3f62a19e51522))
* **deps-core:** update electron to v44.4.1 ([#3692](https://github.com/setchy/atlassify/issues/3692)) ([ceb99d2](https://github.com/setchy/atlassify/commit/ceb99d2ed1f70e1ffc4e112f15d98a31acb3ac6d))


### 📦 Dependency Updates (Other)

* **deps:** lock file maintenance ([#3697](https://github.com/setchy/atlassify/issues/3697)) ([65d8a61](https://github.com/setchy/atlassify/commit/65d8a616815947d4c51d93940ac03f17bfa59820))
* **deps:** update @biomejs/biome to v2.5.14 ([#3694](https://github.com/setchy/atlassify/issues/3694)) ([251a526](https://github.com/setchy/atlassify/commit/251a52620a9f65374b4c3a7129b73b4cb4478a28))
* **deps:** update @types/node to v24.13.5 ([#3688](https://github.com/setchy/atlassify/issues/3688)) ([a3ae4a0](https://github.com/setchy/atlassify/commit/a3ae4a0a98bbd53b5f2fb47e5d15c227e0f1528a))
* **deps:** update i18next-cli to v1.73.3 ([#3664](https://github.com/setchy/atlassify/issues/3664)) ([c3ad690](https://github.com/setchy/atlassify/commit/c3ad690cb47f60973952feecd07710e80010c288))
* **deps:** update i18next-cli to v1.74.0 ([#3696](https://github.com/setchy/atlassify/issues/3696)) ([db6fb2e](https://github.com/setchy/atlassify/commit/db6fb2ee4a5b089775f3b92d2e6019496a6f5d38))
* **deps:** update pnpm to v12.4.2 ([#3689](https://github.com/setchy/atlassify/issues/3689)) ([c7b6cdf](https://github.com/setchy/atlassify/commit/c7b6cdfea518763b078d1b4eb1a4ce2b85e1275b))
* **deps:** update react-i18next to v17.0.14 ([#3663](https://github.com/setchy/atlassify/issues/3663)) ([ff6e9f8](https://github.com/setchy/atlassify/commit/ff6e9f8ae478016554547e111569e525de93d9a8))
* **deps:** update react-router-dom to v7.18.4 ([#3690](https://github.com/setchy/atlassify/issues/3690)) ([22dd3ff](https://github.com/setchy/atlassify/commit/22dd3ffc7c461e9ba7397169ebe23c25c3bde5ca))
* **deps:** update sonarsource/sonarqube-scan-action action to v8.2.2 ([#3665](https://github.com/setchy/atlassify/issues/3665)) ([cd0ede1](https://github.com/setchy/atlassify/commit/cd0ede139899d8d7f3112269c63b6b1fc572e495))
* **deps:** update vitest monorepo to v5.0.1 ([#3691](https://github.com/setchy/atlassify/issues/3691)) ([91318b5](https://github.com/setchy/atlassify/commit/91318b5a1d7456be09128c7c6b51130bddaf2e6f))

## [3.16.0](https://github.com/setchy/atlassify/compare/v3.15.0...v3.16.0) (2026-09-15)


### 🚀 Features

* **api:** harden query paths ([#3659](https://github.com/setchy/atlassify/issues/3659)) ([89f9e92](https://github.com/setchy/atlassify/commit/89f9e9257bd8016bbcfd18b3648cf3a5945e4716))
* electron-menubar v11 migration ([#3631](https://github.com/setchy/atlassify/issues/3631)) ([92ccbbc](https://github.com/setchy/atlassify/commit/92ccbbc328e6a69b9e7f42bf3dd8ce96afe4ac20))


### 🐛 Bug Fixes

* permissions ([739c18c](https://github.com/setchy/atlassify/commit/739c18ce81f41c8e7c8f962d09211f50bc8beacf))
* release please exclude ([5ccb429](https://github.com/setchy/atlassify/commit/5ccb4291ce803c88488043b9caa802cd8af784d6))


### 🧼 Code Refactoring

* replace `cn` util with dep ([#3589](https://github.com/setchy/atlassify/issues/3589)) ([6813af1](https://github.com/setchy/atlassify/commit/6813af1b65a8e9869e2524b2121ea2913e5fdf69))


### 🏗️ Build System

* update PRs on release ([fc1a9ef](https://github.com/setchy/atlassify/commit/fc1a9efeece059f68495cbbae492c144dc08d694))


### 🤖 Continuous Integration

* add comments to PR on rel ([#3660](https://github.com/setchy/atlassify/issues/3660)) ([fc1a9ef](https://github.com/setchy/atlassify/commit/fc1a9efeece059f68495cbbae492c144dc08d694))
* exclude docs in release please ([74fdbcf](https://github.com/setchy/atlassify/commit/74fdbcf3787f1130e37e1ec537a5c93041dfe95e))
* release-please automation ([#3630](https://github.com/setchy/atlassify/issues/3630)) ([55df24c](https://github.com/setchy/atlassify/commit/55df24cfad5ca155198d984e209c18ab2a361832))
* revert use release-please cli directly ([841cf8e](https://github.com/setchy/atlassify/commit/841cf8ecb0c63db91e086604fe34e4ee22cbfde3))
* use release-please cli directly ([89908cc](https://github.com/setchy/atlassify/commit/89908cc896a278977532aabe1b0421522aa542df))


### 📦 Dependency Updates (Core)

* **deps-core:** update @atlaskit/button to v25.3.3 ([#3633](https://github.com/setchy/atlassify/issues/3633)) ([4b487a9](https://github.com/setchy/atlassify/commit/4b487a9e901e6011657a2c7dabc4682b5a9a36e2))
* **deps-core:** update @atlaskit/css-reset to v8.4.1 ([#3634](https://github.com/setchy/atlassify/issues/3634)) ([5e72127](https://github.com/setchy/atlassify/commit/5e721274b76c4fd6d0c19e47ee46e616fd10b238))
* **deps-core:** update @atlaskit/logo to v21.6.1 ([#3635](https://github.com/setchy/atlassify/issues/3635)) ([1204058](https://github.com/setchy/atlassify/commit/1204058a8a527c938a64fa3388d758bc37b79f72))
* **deps-core:** update @atlaskit/logo to v23 ([#3654](https://github.com/setchy/atlassify/issues/3654)) ([a8051fd](https://github.com/setchy/atlassify/commit/a8051fd88f76c430c72cf13f07f05a3acdf4e772))
* **deps-core:** update @atlaskit/modal-dialog to v16.6.2 ([#3636](https://github.com/setchy/atlassify/issues/3636)) ([b7e85be](https://github.com/setchy/atlassify/commit/b7e85be43374cdd4450e56aacc18fec62bf84264))
* **deps-core:** update @atlaskit/select to v22.11.2 ([#3637](https://github.com/setchy/atlassify/issues/3637)) ([67734f9](https://github.com/setchy/atlassify/commit/67734f90ecd146b9b2e696396686ea60e072bb24))
* **deps-core:** update @atlaskit/textfield to v10.2.2 ([#3638](https://github.com/setchy/atlassify/issues/3638)) ([8914bae](https://github.com/setchy/atlassify/commit/8914baead883b1ce2dd2b64bb0fdccc3d32bb725))
* **deps-core:** update @atlaskit/tokens to v16.12.0 ([#3646](https://github.com/setchy/atlassify/issues/3646)) ([794f75f](https://github.com/setchy/atlassify/commit/794f75f155ce963cacb9d9495cce6299ca228b63))
* **deps-core:** update electron to v44.3.0 ([#3647](https://github.com/setchy/atlassify/issues/3647)) ([257686e](https://github.com/setchy/atlassify/commit/257686e2da4c552bc9592f556fa74ffecc1e0560))


### 📦 Dependency Updates (Other)

* **deps:** lock file maintenance ([#3545](https://github.com/setchy/atlassify/issues/3545)) ([27e88cb](https://github.com/setchy/atlassify/commit/27e88cb3b52155d2c1cf065e51d567261f87b6f9))
* **deps:** lock file maintenance ([#3625](https://github.com/setchy/atlassify/issues/3625)) ([a3c893d](https://github.com/setchy/atlassify/commit/a3c893d12dd25b1fad0f8522eef90f90482b205b))
* **deps:** lock file maintenance ([#3656](https://github.com/setchy/atlassify/issues/3656)) ([9048664](https://github.com/setchy/atlassify/commit/904866429a692edb39ddcc1ae9fbdb5b07e2df96))
* **deps:** update @atlaskit/avatar to v27.2.2 ([#3548](https://github.com/setchy/atlassify/issues/3548)) ([6875757](https://github.com/setchy/atlassify/commit/687575773792c2cda096657f6947511731cef2ce))
* **deps:** update @atlaskit/avatar to v27.3.0 ([#3565](https://github.com/setchy/atlassify/issues/3565)) ([cdcf57e](https://github.com/setchy/atlassify/commit/cdcf57e82de1d98eca4a96b535a1791be034652e))
* **deps:** update @atlaskit/avatar to v28 ([#3604](https://github.com/setchy/atlassify/issues/3604)) ([7d99d54](https://github.com/setchy/atlassify/commit/7d99d542539c478b44e440ae8391a18b6c28749e))
* **deps:** update @atlaskit/avatar-group to v14.2.2 ([#3510](https://github.com/setchy/atlassify/issues/3510)) ([e9a276d](https://github.com/setchy/atlassify/commit/e9a276d8870ae31b292d8f252a573b2e3b0ebe27))
* **deps:** update @atlaskit/avatar-group to v14.2.3 ([#3549](https://github.com/setchy/atlassify/issues/3549)) ([5dcd086](https://github.com/setchy/atlassify/commit/5dcd086308444a122f6c419b897e9b822dba6830))
* **deps:** update @atlaskit/avatar-group to v14.3.0 ([#3566](https://github.com/setchy/atlassify/issues/3566)) ([a8c4a4a](https://github.com/setchy/atlassify/commit/a8c4a4acf4879aaea4e5eac1caf150657bce6b99))
* **deps:** update @atlaskit/avatar-group to v14.3.3 ([#3594](https://github.com/setchy/atlassify/issues/3594)) ([ffe026f](https://github.com/setchy/atlassify/commit/ffe026fe9b80ac02187a138e5f3d3ebc5d783374))
* **deps:** update @atlaskit/badge to v21.2.0 ([#3567](https://github.com/setchy/atlassify/issues/3567)) ([2ed1f0f](https://github.com/setchy/atlassify/commit/2ed1f0fb963abcd4d6ed8f3b71866b29a5c5f782))
* **deps:** update @atlaskit/button to v25.2.1 ([#3550](https://github.com/setchy/atlassify/issues/3550)) ([b0704ef](https://github.com/setchy/atlassify/commit/b0704ef88f88251e5c27017be0ecd5c2dda4884c))
* **deps:** update @atlaskit/button to v25.3.0 ([#3568](https://github.com/setchy/atlassify/issues/3568)) ([7fb0d59](https://github.com/setchy/atlassify/commit/7fb0d59a0cc4b4c7a817f758cda33819cce027cf))
* **deps:** update @atlaskit/button to v25.3.2 ([#3595](https://github.com/setchy/atlassify/issues/3595)) ([ba5c753](https://github.com/setchy/atlassify/commit/ba5c753b0b3a0b0d581322fbffb2dcec5fc8f411))
* **deps:** update @atlaskit/checkbox to v19.1.1 ([#3551](https://github.com/setchy/atlassify/issues/3551)) ([a19fec9](https://github.com/setchy/atlassify/commit/a19fec9e0df9620dcae0e952fa334702f8b0670c))
* **deps:** update @atlaskit/checkbox to v19.2.0 ([#3569](https://github.com/setchy/atlassify/issues/3569)) ([b18b7f4](https://github.com/setchy/atlassify/commit/b18b7f4269039b4d78da1e66d26b52239958b8aa))
* **deps:** update @atlaskit/css to v1.1.0 ([#3530](https://github.com/setchy/atlassify/issues/3530)) ([5cee099](https://github.com/setchy/atlassify/commit/5cee0993c50ffb9a9b925d8bb453ab434b5fbf4f))
* **deps:** update @atlaskit/css to v1.1.1 ([#3533](https://github.com/setchy/atlassify/issues/3533)) ([d8180a8](https://github.com/setchy/atlassify/commit/d8180a82c0f8b0f83cc3db2cd86502f80dccbe0b))
* **deps:** update @atlaskit/css to v1.1.2 ([#3552](https://github.com/setchy/atlassify/issues/3552)) ([5e764c9](https://github.com/setchy/atlassify/commit/5e764c954ad4923d8b83217b881f6de99a84f7a8))
* **deps:** update @atlaskit/css-reset to v8.3.2 ([#3553](https://github.com/setchy/atlassify/issues/3553)) ([a166c30](https://github.com/setchy/atlassify/commit/a166c3083ab7f2c9b5c1e33b07d28429459fa5ad))
* **deps:** update @atlaskit/css-reset to v8.4.0 ([#3570](https://github.com/setchy/atlassify/issues/3570)) ([10950d9](https://github.com/setchy/atlassify/commit/10950d946fa64eff5902c584ea448ef40db4551e))
* **deps:** update @atlaskit/form to v17.1.2 ([#3554](https://github.com/setchy/atlassify/issues/3554)) ([224d7fb](https://github.com/setchy/atlassify/commit/224d7fb81d104571c122a652ee7fefeac6693c78))
* **deps:** update @atlaskit/form to v17.2.0 ([#3571](https://github.com/setchy/atlassify/issues/3571)) ([6df137f](https://github.com/setchy/atlassify/commit/6df137f0d69a756f9ca2d06325d88ea0a27f5d4d))
* **deps:** update @atlaskit/heading to v7.1.1 ([#3555](https://github.com/setchy/atlassify/issues/3555)) ([3c04aec](https://github.com/setchy/atlassify/commit/3c04aec943d23c9571aa4755646e05850fde4b0f))
* **deps:** update @atlaskit/heading to v7.2.0 ([#3572](https://github.com/setchy/atlassify/issues/3572)) ([ecbb5c8](https://github.com/setchy/atlassify/commit/ecbb5c8f67001f2dffdb6bd0997cf5743bde3986))
* **deps:** update @atlaskit/icon to v37.5.1 ([#3511](https://github.com/setchy/atlassify/issues/3511)) ([1d98e57](https://github.com/setchy/atlassify/commit/1d98e5786134bf0432de28114cef62a2ebcbf421))
* **deps:** update @atlaskit/icon to v37.5.2 ([#3524](https://github.com/setchy/atlassify/issues/3524)) ([50332b7](https://github.com/setchy/atlassify/commit/50332b729b0cdaf9830acf90f7361c06dc993813))
* **deps:** update @atlaskit/icon to v37.5.3 ([#3534](https://github.com/setchy/atlassify/issues/3534)) ([c1354b2](https://github.com/setchy/atlassify/commit/c1354b2771c217e21b6e00e46e69690ef53f5913))
* **deps:** update @atlaskit/icon to v37.6.0 ([#3573](https://github.com/setchy/atlassify/issues/3573)) ([190d49b](https://github.com/setchy/atlassify/commit/190d49bd1f9a3da2cda8bc20bcced4a2e826723d))
* **deps:** update @atlaskit/icon-lab to v7.7.1 ([#3535](https://github.com/setchy/atlassify/issues/3535)) ([4758fa4](https://github.com/setchy/atlassify/commit/4758fa45463c61373c1de62556e7ad261f0f9981))
* **deps:** update @atlaskit/icon-lab to v7.7.2 ([#3556](https://github.com/setchy/atlassify/issues/3556)) ([e9ca2f3](https://github.com/setchy/atlassify/commit/e9ca2f39df3aee79d6baca54efbcf816071ce86e))
* **deps:** update @atlaskit/icon-lab to v7.8.0 ([#3608](https://github.com/setchy/atlassify/issues/3608)) ([e45710d](https://github.com/setchy/atlassify/commit/e45710d4bbbfbf70303a8d74cdfda8554c8b186b))
* **deps:** update @atlaskit/inline-message to v16.3.1 ([#3557](https://github.com/setchy/atlassify/issues/3557)) ([4bbe6f8](https://github.com/setchy/atlassify/commit/4bbe6f8f1a8d9dcd2c13e5d8d1bce09443d0d0ac))
* **deps:** update @atlaskit/inline-message to v16.4.0 ([#3574](https://github.com/setchy/atlassify/issues/3574)) ([c00890e](https://github.com/setchy/atlassify/commit/c00890eb2d4d2645433fe9ffdab0240821024b9f))
* **deps:** update @atlaskit/logo to v21.5.1 ([#3512](https://github.com/setchy/atlassify/issues/3512)) ([d231746](https://github.com/setchy/atlassify/commit/d2317462cab1539721f02afb9f6c211ec5b9063e))
* **deps:** update @atlaskit/logo to v21.5.2 ([#3558](https://github.com/setchy/atlassify/issues/3558)) ([33475bb](https://github.com/setchy/atlassify/commit/33475bbeb29a5a79367398e262e52c843cf7947a))
* **deps:** update @atlaskit/logo to v21.6.0 ([#3575](https://github.com/setchy/atlassify/issues/3575)) ([09e6257](https://github.com/setchy/atlassify/commit/09e625705ef8d4643abc1a92eed7497e0e46ec69))
* **deps:** update @atlaskit/modal-dialog to v16.5.3 ([#3513](https://github.com/setchy/atlassify/issues/3513)) ([660a9eb](https://github.com/setchy/atlassify/commit/660a9ebe6414347f9f15e4d82fa6578ec58ec894))
* **deps:** update @atlaskit/modal-dialog to v16.5.4 ([#3559](https://github.com/setchy/atlassify/issues/3559)) ([7cc7d6e](https://github.com/setchy/atlassify/commit/7cc7d6e075fda5485d063d0d02afc8e4a7cef87b))
* **deps:** update @atlaskit/modal-dialog to v16.6.0 ([#3576](https://github.com/setchy/atlassify/issues/3576)) ([9605c84](https://github.com/setchy/atlassify/commit/9605c84e60623fa2b8c980e3c1f5d278ddfccc5f))
* **deps:** update @atlaskit/modal-dialog to v16.6.1 ([#3616](https://github.com/setchy/atlassify/issues/3616)) ([648aca6](https://github.com/setchy/atlassify/commit/648aca6cc7366f3fd94fa46dc2beda8b001de9c8))
* **deps:** update @atlaskit/primitives to v22.4.1 ([#3536](https://github.com/setchy/atlassify/issues/3536)) ([6551e80](https://github.com/setchy/atlassify/commit/6551e8068d910e2e2040687a0d91a6fe8114eaf6))
* **deps:** update @atlaskit/primitives to v22.5.0 ([#3577](https://github.com/setchy/atlassify/issues/3577)) ([99891f1](https://github.com/setchy/atlassify/commit/99891f1c3672765dc0e050d4aa9f90775901da77))
* **deps:** update @atlaskit/radio to v10.1.1 ([#3560](https://github.com/setchy/atlassify/issues/3560)) ([f373130](https://github.com/setchy/atlassify/commit/f37313087a2bf657d48e8427d00924196e1f7cc0))
* **deps:** update @atlaskit/radio to v10.2.0 ([#3578](https://github.com/setchy/atlassify/issues/3578)) ([fccc75a](https://github.com/setchy/atlassify/commit/fccc75ad03f7de53874bedc9a6bffd82188d133a))
* **deps:** update @atlaskit/select to v22.10.0 ([#3531](https://github.com/setchy/atlassify/issues/3531)) ([5576ca3](https://github.com/setchy/atlassify/commit/5576ca37d7da531c2db28c6406f9d01dbcc606a3))
* **deps:** update @atlaskit/select to v22.11.0 ([#3579](https://github.com/setchy/atlassify/issues/3579)) ([67c238b](https://github.com/setchy/atlassify/commit/67c238b9ae1831a4d014f08c1514a3e6a55e8ea5))
* **deps:** update @atlaskit/select to v22.11.1 ([#3626](https://github.com/setchy/atlassify/issues/3626)) ([feead7d](https://github.com/setchy/atlassify/commit/feead7dee6123d07327c12894df42729534b1bed))
* **deps:** update @atlaskit/select to v22.9.1 ([#3519](https://github.com/setchy/atlassify/issues/3519)) ([4a8c075](https://github.com/setchy/atlassify/commit/4a8c075411c71397bb2d47459a1aacb78090bfbc))
* **deps:** update @atlaskit/spinner to v20.3.1 ([#3561](https://github.com/setchy/atlassify/issues/3561)) ([c589737](https://github.com/setchy/atlassify/commit/c58973703d2088c2afb1843a55585c1716a730b2))
* **deps:** update @atlaskit/spinner to v20.4.0 ([#3580](https://github.com/setchy/atlassify/issues/3580)) ([4a7e6ee](https://github.com/setchy/atlassify/commit/4a7e6ee50eb27983c42a0bf86a00eaf367f1b13d))
* **deps:** update @atlaskit/tag to v15.7.3 ([#3520](https://github.com/setchy/atlassify/issues/3520)) ([d9b450c](https://github.com/setchy/atlassify/commit/d9b450ceba3709be1fb473c425bfdd863d0d6074))
* **deps:** update @atlaskit/tag to v15.7.4 ([#3537](https://github.com/setchy/atlassify/issues/3537)) ([350b2bd](https://github.com/setchy/atlassify/commit/350b2bd06dda812345745b1da701b56605f37a6e))
* **deps:** update @atlaskit/tag to v15.8.0 ([#3581](https://github.com/setchy/atlassify/issues/3581)) ([4dd7851](https://github.com/setchy/atlassify/commit/4dd7851d16a5d4906a916bbb8b639a7c23bc4859))
* **deps:** update @atlaskit/tag to v15.8.1 ([#3596](https://github.com/setchy/atlassify/issues/3596)) ([7466033](https://github.com/setchy/atlassify/commit/74660332e217758db9c106fce7a8ac1a4f10663d))
* **deps:** update @atlaskit/tag-group to v13.3.0 ([#3521](https://github.com/setchy/atlassify/issues/3521)) ([35a2a37](https://github.com/setchy/atlassify/commit/35a2a37f91965cb9de8694243104551c6c84705d))
* **deps:** update @atlaskit/tag-group to v13.4.0 ([#3582](https://github.com/setchy/atlassify/issues/3582)) ([cf2b20f](https://github.com/setchy/atlassify/commit/cf2b20f00758fab2d152ad3ac66f2765fb32148d))
* **deps:** update @atlaskit/textfield to v10.2.0 ([#3583](https://github.com/setchy/atlassify/issues/3583)) ([74168fa](https://github.com/setchy/atlassify/commit/74168fa21c6968de084e0015aa23c4f3b6031391))
* **deps:** update @atlaskit/textfield to v10.2.1 ([#3610](https://github.com/setchy/atlassify/issues/3610)) ([3c859f6](https://github.com/setchy/atlassify/commit/3c859f689a8500d94801ba1fd309470dd2eddd2a))
* **deps:** update @atlaskit/toggle to v17.3.0 ([#3584](https://github.com/setchy/atlassify/issues/3584)) ([5622114](https://github.com/setchy/atlassify/commit/562211439bb725eba5b400f53336ad5700091479))
* **deps:** update @atlaskit/tokens to v16.10.0 ([#3585](https://github.com/setchy/atlassify/issues/3585)) ([1a0535a](https://github.com/setchy/atlassify/commit/1a0535a2940781c94685f8759fbffb87f17ba461))
* **deps:** update @atlaskit/tokens to v16.11.0 ([#3592](https://github.com/setchy/atlassify/issues/3592)) ([b14732c](https://github.com/setchy/atlassify/commit/b14732c55c08399418a4f142bef7a13c2e9c8fb5))
* **deps:** update @atlaskit/tokens to v16.11.1 ([#3597](https://github.com/setchy/atlassify/issues/3597)) ([e8769da](https://github.com/setchy/atlassify/commit/e8769da41558c6483848b8a382ed7bd8b51bc752))
* **deps:** update @atlaskit/tokens to v16.11.2 ([#3606](https://github.com/setchy/atlassify/issues/3606)) ([78bdf58](https://github.com/setchy/atlassify/commit/78bdf58c87f752033d183d1843697c58a97b4d20))
* **deps:** update @atlaskit/tokens to v16.8.1 ([#3514](https://github.com/setchy/atlassify/issues/3514)) ([c749735](https://github.com/setchy/atlassify/commit/c7497354829ab673c8445dcaef58d033c1cacd80))
* **deps:** update @atlaskit/tokens to v16.9.0 ([#3547](https://github.com/setchy/atlassify/issues/3547)) ([616fa92](https://github.com/setchy/atlassify/commit/616fa92f3874b85ba7bd3e4fb4a94a565ace9bb2))
* **deps:** update @atlaskit/tooltip to v24.2.1 ([#3525](https://github.com/setchy/atlassify/issues/3525)) ([ccf384e](https://github.com/setchy/atlassify/commit/ccf384e26f783c3347eb440c520f497ed7ebb2f4))
* **deps:** update @atlaskit/tooltip to v24.3.0 ([#3586](https://github.com/setchy/atlassify/issues/3586)) ([9b2408f](https://github.com/setchy/atlassify/commit/9b2408f7588c7d1f7006612e9eeebefc0fc2560f))
* **deps:** update @biomejs/biome to v2.5.11 ([#3538](https://github.com/setchy/atlassify/issues/3538)) ([37dc8c7](https://github.com/setchy/atlassify/commit/37dc8c769dc50c0d4a14637ff572a0781d485e15))
* **deps:** update @biomejs/biome to v2.5.12 ([#3617](https://github.com/setchy/atlassify/issues/3617)) ([c75817a](https://github.com/setchy/atlassify/commit/c75817a58cca3e443b6742d7b790ab39c878b99e))
* **deps:** update @biomejs/biome to v2.5.13 ([#3639](https://github.com/setchy/atlassify/issues/3639)) ([cc93af7](https://github.com/setchy/atlassify/commit/cc93af75c0febdca0a1f0a293ead10759af74f4f))
* **deps:** update @compiled/react to v2 ([#3522](https://github.com/setchy/atlassify/issues/3522)) ([e5dbc36](https://github.com/setchy/atlassify/commit/e5dbc3631d852ecb0bfa41535252c1281d35f1d9))
* **deps:** update @compiled/vite-plugin to v2.0.3 ([#3515](https://github.com/setchy/atlassify/issues/3515)) ([6b0fa7c](https://github.com/setchy/atlassify/commit/6b0fa7c645c0634a757706b1be610fd9386e2a27))
* **deps:** update @graphql-codegen/cli to v7.4.0 ([#3602](https://github.com/setchy/atlassify/issues/3602)) ([88a3def](https://github.com/setchy/atlassify/commit/88a3def103ada8139d62cddfb55d13ee8d3bac6e))
* **deps:** update @graphql-codegen/cli to v7.4.1 ([#3640](https://github.com/setchy/atlassify/issues/3640)) ([501ae2c](https://github.com/setchy/atlassify/commit/501ae2c74006d97a8f772182d9f6c6c4624c7104))
* **deps:** update @tanstack/react-query to v5.102.4 ([#3516](https://github.com/setchy/atlassify/issues/3516)) ([0083970](https://github.com/setchy/atlassify/commit/008397017da3e91541882eb183cc5b15f0aa6821))
* **deps:** update @tanstack/react-query to v5.102.6 ([#3526](https://github.com/setchy/atlassify/issues/3526)) ([103176c](https://github.com/setchy/atlassify/commit/103176c362f1f69e7b5c76be9261e56eb88ee878))
* **deps:** update @tanstack/react-query to v5.102.8 ([#3539](https://github.com/setchy/atlassify/issues/3539)) ([9ad9ef7](https://github.com/setchy/atlassify/commit/9ad9ef77e906cf9bbd71f3fcf823a6a7947d3f4f))
* **deps:** update @testing-library/react to v16.3.3 ([#3540](https://github.com/setchy/atlassify/issues/3540)) ([36d603a](https://github.com/setchy/atlassify/commit/36d603a443bc65dd67de5025e1f04b2730a40fcf))
* **deps:** update @testing-library/user-event to v14.6.7 ([#3605](https://github.com/setchy/atlassify/issues/3605)) ([2fe5f7f](https://github.com/setchy/atlassify/commit/2fe5f7f5501d446ecd17e7bc6df1000d79ce5da0))
* **deps:** update @types/react-dom to v19.2.7 ([#3618](https://github.com/setchy/atlassify/issues/3618)) ([ea5aff1](https://github.com/setchy/atlassify/commit/ea5aff1e55257779d0cfa9b6a2b937b004f204a6))
* **deps:** update @vitejs/plugin-react to v6.1.1 ([#3546](https://github.com/setchy/atlassify/issues/3546)) ([8324455](https://github.com/setchy/atlassify/commit/83244551b5a50eabcfcdb3b6b18398890711ece4))
* **deps:** update axios to v1.20.0 ([#3532](https://github.com/setchy/atlassify/issues/3532)) ([04f1d6a](https://github.com/setchy/atlassify/commit/04f1d6ae77ef2c8590dd8c7c8d67e2358356b8ec))
* **deps:** update cn to v0.2.5 ([#3627](https://github.com/setchy/atlassify/issues/3627)) ([10b31f0](https://github.com/setchy/atlassify/commit/10b31f0cecfa17aed93334176ded542378b3383e))
* **deps:** update cn to v0.3.0 ([#3648](https://github.com/setchy/atlassify/issues/3648)) ([5dd4f66](https://github.com/setchy/atlassify/commit/5dd4f66488b30495dd9e50bd0cbf00d1115cc7c7))
* **deps:** update electron to v44 ([#3523](https://github.com/setchy/atlassify/issues/3523)) ([314118d](https://github.com/setchy/atlassify/commit/314118d86638bcb93789946486b31bc32f70e5f8))
* **deps:** update electron to v44.1.0 ([#3593](https://github.com/setchy/atlassify/issues/3593)) ([19eeeea](https://github.com/setchy/atlassify/commit/19eeeeaefd5012768d2e2fe1df91f0e608fafb45))
* **deps:** update electron to v44.1.1 ([#3598](https://github.com/setchy/atlassify/issues/3598)) ([89ef31d](https://github.com/setchy/atlassify/commit/89ef31d6d75225826dd472d36507b94a94d5f4db))
* **deps:** update electron to v44.2.0 ([#3629](https://github.com/setchy/atlassify/issues/3629)) ([b15751c](https://github.com/setchy/atlassify/commit/b15751cf3c2cee85064c3f29a19633f54bd254e4))
* **deps:** update happy-dom to v20.11.12 ([#3542](https://github.com/setchy/atlassify/issues/3542)) ([f591cbf](https://github.com/setchy/atlassify/commit/f591cbfa3267aca6e64c6beacdfa7733d0615aa6))
* **deps:** update happy-dom to v20.11.15 ([#3562](https://github.com/setchy/atlassify/issues/3562)) ([0bbcfef](https://github.com/setchy/atlassify/commit/0bbcfef1c13a03a5884b3caae524380f4030d9c9))
* **deps:** update happy-dom to v20.11.8 ([#3528](https://github.com/setchy/atlassify/issues/3528)) ([b889072](https://github.com/setchy/atlassify/commit/b889072fdd8cbbed751a1545b37a84a4112eb0b2))
* **deps:** update happy-dom to v20.12.0 ([#3587](https://github.com/setchy/atlassify/issues/3587)) ([24c0075](https://github.com/setchy/atlassify/commit/24c0075e0e2a974dd097d67c453c0cd8ad6a00c2))
* **deps:** update happy-dom to v20.13.0 ([#3599](https://github.com/setchy/atlassify/issues/3599)) ([cffb864](https://github.com/setchy/atlassify/commit/cffb864dc3688b3d50548326f662e910b36c6c1e))
* **deps:** update happy-dom to v20.13.2 ([#3611](https://github.com/setchy/atlassify/issues/3611)) ([9962064](https://github.com/setchy/atlassify/commit/9962064e26c07af4637ba93ff3b8cde19d431e28))
* **deps:** update happy-dom to v20.14.0 ([#3622](https://github.com/setchy/atlassify/issues/3622)) ([4ac641a](https://github.com/setchy/atlassify/commit/4ac641ae1f2bc5005482f4321aadd5c9801bfafe))
* **deps:** update happy-dom to v20.14.5 ([#3642](https://github.com/setchy/atlassify/issues/3642)) ([7019286](https://github.com/setchy/atlassify/commit/7019286874948f84e12fff1e138b1220f0be97ee))
* **deps:** update i18next to v26.4.1 ([#3600](https://github.com/setchy/atlassify/issues/3600)) ([fac54b0](https://github.com/setchy/atlassify/commit/fac54b0faa12a0743ba646b889f7f99b1522421f))
* **deps:** update i18next to v26.4.2 ([#3619](https://github.com/setchy/atlassify/issues/3619)) ([88651c2](https://github.com/setchy/atlassify/commit/88651c2e41a7f8caaa1fdcc0ff99b98b1cb16f50))
* **deps:** update i18next-cli to v1.71.3 ([#3518](https://github.com/setchy/atlassify/issues/3518)) ([d1fb1e4](https://github.com/setchy/atlassify/commit/d1fb1e4b3cf88625ea2bb280dd03ae50c76ab4f1))
* **deps:** update i18next-cli to v1.72.1 ([#3603](https://github.com/setchy/atlassify/issues/3603)) ([a260697](https://github.com/setchy/atlassify/commit/a26069735c70e9b5555f28ea4db432d7784cd46f))
* **deps:** update i18next-cli to v1.72.2 ([#3607](https://github.com/setchy/atlassify/issues/3607)) ([6bdd347](https://github.com/setchy/atlassify/commit/6bdd3471e040ba8acc7d084b7aa8aec646889bd2))
* **deps:** update i18next-cli to v1.72.4 ([#3612](https://github.com/setchy/atlassify/issues/3612)) ([e787b30](https://github.com/setchy/atlassify/commit/e787b305ae1477874e4f2984cc588be8f19b86cc))
* **deps:** update i18next-cli to v1.73.0 ([#3623](https://github.com/setchy/atlassify/issues/3623)) ([a3509b8](https://github.com/setchy/atlassify/commit/a3509b861c5db405aa245f3bea160fcef0838408))
* **deps:** update i18next-cli to v1.73.2 ([#3643](https://github.com/setchy/atlassify/issues/3643)) ([9deab2b](https://github.com/setchy/atlassify/commit/9deab2bf86d84f4a1bf54fabfb6b8d6ca6291c90))
* **deps:** update node.js to v24.21.0 ([#3649](https://github.com/setchy/atlassify/issues/3649)) ([acbdb6c](https://github.com/setchy/atlassify/commit/acbdb6c38d73a3aa3ee2db8cba8db110f04f710e))
* **deps:** update pnpm to v11.25.0 ([#3588](https://github.com/setchy/atlassify/issues/3588)) ([e7b6b6f](https://github.com/setchy/atlassify/commit/e7b6b6f6afa9e57c73c255783f6eebe68a9a9b2f))
* **deps:** update pnpm to v12 ([#3615](https://github.com/setchy/atlassify/issues/3615)) ([12e6c9b](https://github.com/setchy/atlassify/commit/12e6c9b939d518fa1a013f739e1d241ea87a7884))
* **deps:** update pnpm to v12.3.2 ([#3620](https://github.com/setchy/atlassify/issues/3620)) ([f762b21](https://github.com/setchy/atlassify/commit/f762b2149bba4ab5e502f4f149fd2bae0a7f7786))
* **deps:** update pnpm to v12.3.4 ([#3628](https://github.com/setchy/atlassify/issues/3628)) ([9940a2c](https://github.com/setchy/atlassify/commit/9940a2c14da6179d527a52525d110ea1729e2dd4))
* **deps:** update pnpm/action-setup action to v6.1.0 ([#3609](https://github.com/setchy/atlassify/issues/3609)) ([922ed33](https://github.com/setchy/atlassify/commit/922ed33590456cfa654bb2dfba51efa1fa2544cd))
* **deps:** update react monorepo to v19.3.0 ([#3651](https://github.com/setchy/atlassify/issues/3651)) ([2965baf](https://github.com/setchy/atlassify/commit/2965baf8f2e813d71a1c582a7cb161a9787e1f7e))
* **deps:** update react-devtools to v8 ([#3655](https://github.com/setchy/atlassify/issues/3655)) ([d732d7f](https://github.com/setchy/atlassify/commit/d732d7f72ba7a2bd276809adf1cfe668c0981150))
* **deps:** update react-i18next to v17.0.13 ([#3601](https://github.com/setchy/atlassify/issues/3601)) ([0eaf633](https://github.com/setchy/atlassify/commit/0eaf6331f6d2daddbab12896f9238f2856c7a73c))
* **deps:** update react-router-dom to v7.18.3 ([#3563](https://github.com/setchy/atlassify/issues/3563)) ([cf93bdd](https://github.com/setchy/atlassify/commit/cf93bdd482d71c005bd259d8fbd76fa655175180))
* **deps:** update vite to v8.3.0 ([#3652](https://github.com/setchy/atlassify/issues/3652)) ([d8c26fb](https://github.com/setchy/atlassify/commit/d8c26fbc591ab3868dd6da142dfc34a684f84d26))
* **deps:** update vite-plugin-electron to v1.1.2 ([#3591](https://github.com/setchy/atlassify/issues/3591)) ([ae4792a](https://github.com/setchy/atlassify/commit/ae4792a358a5e3fcdb849d2548a1bab3710806c1))
* **deps:** update vitest monorepo to v5 ([#3624](https://github.com/setchy/atlassify/issues/3624)) ([1b9d07c](https://github.com/setchy/atlassify/commit/1b9d07c942814c46772efcdbeab695744f3792bc))
* **deps:** update zizmorcore/zizmor-action action to v0.6.3 ([#3543](https://github.com/setchy/atlassify/issues/3543)) ([4aa2ae1](https://github.com/setchy/atlassify/commit/4aa2ae1c48d2dc4532460b5f8fb9202ed05127a9))
* **deps:** update zizmorcore/zizmor-action action to v0.6.4 ([#3645](https://github.com/setchy/atlassify/issues/3645)) ([ba652fb](https://github.com/setchy/atlassify/commit/ba652fb8883b0d3838b14a7d76ba0250320afe0d))


### 🧹 Chore

* update release config ([c41cc37](https://github.com/setchy/atlassify/commit/c41cc37415c9ad3c7e7e078ed2e277b34868ab68))

## [3.15.0](https://github.com/setchy/atlassify/compare/v3.14.1...v3.15.0) (2026-08-27)

### Bug Fixes

- handle notifications without an associated product safely ([#3498](https://github.com/setchy/atlassify/pull/3498))

Earlier release history is available on the [GitHub Releases](https://github.com/setchy/atlassify/releases) page.

# template

This is my gulp project template.

## development

### install

#### use yarn

```
yarn install
```

※ if you have not installed yarn

```
npm install --global yarn
```
or
```
brew install yarn
```

#### no use yarn

```
npm install
```


### tasks

gulpコマンドを利用する場合はgulpがglobalにインストールされている必要があります。
また、バージョンにより正しく動作しない可能性があります。

#### start

- `npm start`
    - or `gulp`

- 現在のソースからビルドし、開発用サーバーを起動、ファイルの監視を開始します
    - `server` `build` `watch`タスクを実行します

- おまけ
    - `gulp --develop`でjs,cssをminifyしないようにできます
    - `gulp --port 0000`でportを指定できます

#### server

- `npm run server`
    - or `gulp server`

- 開発用のサーバーを起動します

#### build

- `npm run build`
    - or `gulp build`

- html・css・jsのビルドが走ります

#### watch

- `npm run watch`
    - or `gulp watch`

- html・css・jsのソースファイルを監視し、変更があればそれぞれのビルドを実行します

#### build html
- `npm run build-html`
    - or `gulp html`

#### build css
- `npm run build-css`
    - or `gulp css`

#### build js
- `npm run build-js`
    - or `gulp js`

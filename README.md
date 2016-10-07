# ida

Ida is a static site generator built in Javascript and run as a node.js command line tool. It includes a small server for local development purposes.

## Usage

### Installing

``` 
$ npm install ida -g 
```

### Commands
| Command       | Options (italic is default)   | Description |
| ---           | ---                           | ---         |
| **create**    | [name]                        | Create a new project. If no name is specified the project will be created in the current folder. If a name is specified it will be created as a new directory in the current folder with that name. If the folder is not empty, it will ask to confirm before deleting any content. |
| **new**       | [article/page]                | Create a new page or article. Article is default. |
| **build**     | -                             | Build the site. |
| **watch**     | -                             | Rebuild the site on file changes. Useful to see changes directly in browser. Dev-option is used when rebuilding. |

### Examples

#### Create new project

```
$ ida create my-new-site
```

Will create the following:
```
- ./my-new-site/
  |- articles/
  |- pages/
  |- assets/
  |  |- images
  |  |- css
  |  |- js
  |- templates/
  |- ida.json
  |- README.md
```
  
#### Create a new article or page

```
$ ida new article
```

New content will be defaulted to draft. Drafts are still rendered when running locally, but ignored when building for production.
  
#### Build project

```
$ ida build
```

#### Rebuild project on file change

```
$ ida watch
```

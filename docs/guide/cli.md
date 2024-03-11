# Command Line Interface

### `css2tailwind`

<br />

#### Usage

```sh
$ css2tailwind <styles-directory> <output-directory> [OPTIONS...]
```

#### Arguments

| Argument           | Description                                                 |
| ------------------ | ----------------------------------------------------------- |
| `styles-directory` | Path to the source styles directory (commonly `src/styles`) |
| `output-directory` | Path to the output directory (commonly `.styles`            |

#### Options

| Option                | Description                                                 |
| --------------------- | ----------------------------------------------------------- |
| `-w, --watch`         | Watch for file changes in the styles-directory              |
| `-c, --config <path>` | Path to the tailwind config (default: `tailwind.config.ts`) |
| `-h, --help`          | Show help                                                   |
| `-v, --version`       | Show version number                                         |

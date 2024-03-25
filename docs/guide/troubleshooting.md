# Troubleshooting

## `Error: ENOSPC: System limit for number of file watchers reached, watch`

Linux uses [inotify](https://en.wikipedia.org/wiki/Inotify) to monitor file changes.
This error is due to the file watchers being reached.

In most cases, restarting the dev-server will fix this issue.

If you want a permanent solution, you can increase the maximum number of file watchers.

```sh
# check current number
$ cat /proc/sys/fs/inotify/max_user_watches

# set a greater value
$ echo fs.inotify.max_user_watches=<increased-value> | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

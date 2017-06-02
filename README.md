# Blynk CLI

## Description
This utility provide a way to manage your blynk server from Command-Line Interface (CLI).

This is a work in progress and fully experimental utility. You should not try to use it in production.

## Documentation
Docs are available on https://readthedocs.io/ :

[English](https://blynk-cligithubio.readthedocs.io/) - [Français](https://blynk-cli-fr.readthedocs.io/fr/latest/)

## Installation
### Dependencies
Please, make sure your configuration respect the following pre-requisite:

* Java 8
* NodeJS >= 4.6.1
* npm (or alike)

### Installation
You can install Blynk CLI with NPM:
```console
$ npm install -g blynk-cli
```

## Usage
### Show help
Once Blynk CLI installed, you can show help about existing commands by typing:
```console
$ blynk-cli
# OR
$ blynk-cli help
# OR
$ blynk-cli --help
```

### Install Blynk Server
Once Blynk CLI installed, you'll have to install Blynk server by running:
```console
$ blynk-cli server install
[INFO] Downloading Blynk server v0.24.5
[INFO] Creating default configuration
[OK] Installation complete
```

### Update Blynk Server
You can update Blynk Server to the latest version by running:
```console
$ blynk-cli server update
[INFO] Update v0.24.6 available. Downloading...
[OK] Update complete
[OK] Backup done! You can find it in /home/booteille/.blynkcli/backup/auto-update/b1045268-2f32-4e24-85a3-fb740266d417
```

### Start/Stop/Restart Server
```console
$ blynk-cli server start

$ blynk-cli server status # Display status of Blynk server

$ blynk-cli server stop

$ blynk-cli server restart
```

### Make a backup
You can backup your data folder by typing:
```console
$ blynkcli backup create BACKUP
[OK] Backup done! You can find it in /home/booteille/.blynkcli/backup/BACKUP/cee3acd3-1190-4501-bfc1-ba10423c1a07
```
The backup generated is located in the folder you designed in your Blynk CLI configuration.

As you can see in this example, the generated backup is located under `BACKUP/cee3acd3-1190-4501-bfc1-ba10423c1a07`.
Each backup have an Unique Identifier giving ablity to give the same name to different backups.

You can retrieve backup informations in the file `backups.lock` located in your Backups folder.

Here is what generated the backup we created before:
```console
$ cat /home/booteille/.blynkcli/backup/backups.lock
[
  {
    "name": "BACKUP",
    "uuid": "cee3acd3-1190-4501-bfc1-ba10423c1a07",
    "date": "Thu Jun 01 2017 15:46:50 GMT+0200 (CEST)",
    "server_version": "v0.24.6"
  }
]
```

### Restore from a backup
If you want to restore your data folder from a desired backup, you have to type:
```console
$ blynkcli backup restore BACKUP
[OK] Restored from backup /home/booteille/.blynkcli/backup/BACKUP/cee3acd3-1190-4501-bfc1-ba10423c1a07
```

Now. Admit we have backups under the same name:
```console
$ blynkcli backup restore BACKUP
[WARN] There are 2 backup found with corresponding names:
BACKUP/812de666-6d21-4f36-8877-cc1f775dab73 Thu Jun 01 2017 15:58:44 GMT+0200 (CEST)
BACKUP/cee3acd3-1190-4501-bfc1-ba10423c1a07 Thu Jun 01 2017 15:46:50 GMT+0200 (CEST)
[ERR]  Please, retry with one of these backups
```

Think about the backup you want to restore then type the full name (or at least first characters of uuid) to get your restoration:
```console
$ blynkcli backup restore BACKUP/812
[OK] Restored from backup /home/booteille/.blynkcli/backup/BACKUP/812de666-6d21-4f36-8877-cc1f775dab73
```

You can also restore your backup from the uuid:
```console
$ blynkcli backup restore /cee
[OK] Restored from backup /home/booteille/.blynkcli/backup/BACKUP/cee3acd3-1190-4501-bfc1-ba10423c1a07
```

### Add an user
You can add a new user by typing:
```console
$ blynkcli user add
? Email:  booteille@booteille.com
? Password:  [hidden]
? Confirm your password:  [hidden]
? Is super admin?  true
[OK] User booteille@booteille.com added
```

### Change user properties
You can change an user property by typing:
```console
$ blynkcli user set booteille@booteille.com energy 15000
[OK] Property energy set to 15000
[WARN] You must restart the server to apply the effect
```
Now we can check the new value:
```console
$ blynkcli user get booteille@booteille.com energy
energy: 15000
```

### Clone Projects from one user to another
```console
blynkcli user clone-projects booteille@booteille.com admin@blynk.cc
[OK] admin@blynk.cc projects cloned from booteille@booteille.com
[WARN] You must restart the server to apply the effect
[OK] Backup done! You can find it in /home/sephir/.blynkcli/backup/auto-cloneProfile/07221e9e-3f09-46dc-914a-
```

### Change user password
```console
blynkcli user password booteille@booteille.com
? Password:  [hidden]
? Confirm your password:  [hidden]
[WARN] You must restart the server to apply the effect
```

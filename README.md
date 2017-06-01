# Blynk CLI

## Description
This utility provide a way to manage your blynk server from Command-Line Interface (CLI).

This is a work in progress and fully experimental utility. You should not try to use it in production.

## Installation
### Dependencies
Please, make sure your configuration respect the following pre-requisite:

* Java 8
* NodeJS >= 4.6.1
* npm (or alike)

### Installation
On linux, run the following command as super-user to install Blynk CLI:
```console
npm install -g blynk-cli
```

## Usage
### Show help
Once Blynk CLI installed, you can show help about existing commands by typing:
```console
blynkcli
# OR
blynkcli help
# OR
blynkcli --help
```

### Install Blynk Server
Once Blynk CLI installed, you'll have to install Blynk server by running:
```console
blynkcli server install
```

### Update Blynk Server
You can update Blynk Server to the latest version by running:
```console
blynkcli server update
```

### Start/Stop/Restart Server
```console
blynkcli server start

blynkcli server status # Display status of Blynk server

blynkcli server stop

blynkcli server restart
```

### Make a backup
You can backup your data folder by typing:
```console
$ blynkcli backup create BACKUP
[OK] Backup done! You can find it in /home/booteille/.blynkcli/backup/BACKUP/cee3acd3-1190-4501-bfc1-ba10423c1a07
```
The backup generated is located in the folder you designed in your Blynk CLI configuration.

As you can see in this example, the generated backup is located under `BACKUP/cee3acd3-1190-4501-bfc1-ba10423c1a07`.
Each backup have an Unique Identifier in order to be able to give the same name multiple times to a backup.

You can retrieve backup informations in the file `backups.lock` located in your Backups folder.

Here is what generated the backup we created just before:
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
blynkcli backup restore BACKUP
[OK] Restored from backup /home/booteille/.blynkcli/backup/BACKUP/cee3acd3-1190-4501-bfc1-ba10423c1a07
```

Now. Admit we have backups under the same name:
```console
blynkcli backup restore BACKUP
[WARN] There are 2 backup found with corresponding names:
BACKUP/812de666-6d21-4f36-8877-cc1f775dab73 Thu Jun 01 2017 15:58:44 GMT+0200 (CEST)
BACKUP/cee3acd3-1190-4501-bfc1-ba10423c1a07 Thu Jun 01 2017 15:46:50 GMT+0200 (CEST)
[ERR]  Please, retry with one of these backups
```

Think about the backup you want to restore then type the full name (or at least first characters of uuid) to get your restoration:
```console
blynkcli backup restore BACKUP/812
[OK] Restored from backup /home/booteille/.blynkcli/backup/BACKUP/812de666-6d21-4f36-8877-cc1f775dab73
```

You can also restore your backup from the uuid:
```console
blynkcli backup restore /cee                                                                                                                                                         16:00:26
[OK] Restored from backup /home/booteille/.blynkcli/backup/BACKUP/cee3acd3-1190-4501-bfc1-ba10423c1a07
```
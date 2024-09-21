---
category:
  - Ubuntu系列教程

tag:
  - Linux
  - 服务器

---

# Ubuntu Server 22 虚拟机空间扩容
> 使用 Esxi 安装 Ubuntu Server 后，发现分配的 20G 磁盘空间不够，通过 Esxi 控制台将磁盘扩容到 40G，重启后还需要手动调整

### 将未分区空间添加到已有分区
使用`lsblk`查看分区信息，发现`ubuntu--vg-ubuntu--lv`是在`/dev/sda3`下的逻辑分区，所以需要将未分区的空间添加到`/sda/sda3`分区下


```bash
lsblk
```
结果：
```
NAME                      MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
loop0                       7:0    0  55.6M  1 loop /snap/core18/2538
loop1                       7:1    0    62M  1 loop /snap/core20/1581
loop2                       7:2    0    62M  1 loop /snap/core20/1587
loop3                       7:3    0 118.4M  1 loop /snap/docker/1779
loop4                       7:4    0  79.9M  1 loop /snap/lxd/22923
loop5                       7:5    0    47M  1 loop /snap/snapd/16292
loop6                       7:6    0  44.7M  1 loop /snap/snapd/15534
sda                         8:0    0    50G  0 disk
├─sda1                      8:1    0     1G  0 part /boot/efi
├─sda2                      8:2    0     2G  0 part /boot
└─sda3                      8:3    0  19.9G  0 part
└─ubuntu--vg-ubuntu--lv 253:0    0  18.5G  0 lvm  /
```
### 扩容

1. 调整物理卷的大小

当磁盘大小发生变化后，需要使用`pvresize`调整物理卷的大小
```bash
pvresize /dev/sda3
```
结果：
```
Physical volume "/dev/sda3" changed
1 physical volume(s) resized or updated / 0 physical volume(s) not resized
```

2. 扩容分区

通过`growpart`将未分区空间添加到`/dev/sda`设备的逻辑分区`3`下面
```bash
growpart /dev/sda 3
```
结果：
```
CHANGED: partition=3 start=6397952 old: size=77486080 end=83884032 new: size=161374175 end=167772127
```

3. 使用所有空闲空间为逻辑分区扩容

使用`lvresize`命令进行扩容，将所有空闲的空间都分配给`/dev/mapper/ubuntu--vg-ubuntu--lv`；需要注意的是`/dev/mapper/ubuntu--vg-ubuntu--lv`名称中间是两个`-`符号
```bash
lvresize -l +100%FREE /dev/mapper/ubuntu--vg-ubuntu--lv
```
结果：
```
Size of logical volume ubuntu-vg/ubuntu-lv changed from 18.47 GiB (4729 extents) to <36.95 GiB (9458 extents).
Logical volume ubuntu-vg/ubuntu-lv successfully resized.
```
4. 扩展文件系统本身
扩容完成后，需要扩展文件系统本身，让系统能够使用新的可用的逻辑分区
```bash
resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv
```
结果：
```
resize2fs 1.46.5 (30-Dec-2021)
Filesystem at /dev/mapper/ubuntu--vg-ubuntu--lv is mounted on /; on-line resizing required
old_desc_blocks = 3, new_desc_blocks = 5
The filesystem on /dev/mapper/ubuntu--vg-ubuntu--lv is now 9684992 (4k) blocks long.
```
5. 检查分区大小
使用`df`命令再次检查分区大小，发现`/`挂载的空间大小已经扩容完成了
```
➜  ~ df -hT
Filesystem                        Type   Size  Used Avail Use% Mounted on
tmpfs                             tmpfs  796M  1.4M  794M   1% /run
/dev/mapper/ubuntu--vg-ubuntu--lv ext4    40G   19G   21G  47% /
tmpfs                             tmpfs  3.9G     0  3.9G   0% /dev/shm
tmpfs                             tmpfs  5.0M     0  5.0M   0% /run/lock
/dev/sda2                         ext4   2.0G  127M  1.7G   7% /boot
/dev/sda1                         vfat   1.1G  5.3M  1.1G   1% /boot/efi
tmpfs                             tmpfs  796M  4.0K  796M   1% /run/user/0
```

> [!NOTE]
> 本文转载自[HelloWood](https://blog.hellowood.dev/posts/ubuntu-server-22-%E8%99%9A%E6%8B%9F%E6%9C%BA%E7%A9%BA%E9%97%B4%E6%89%A9%E5%AE%B9/)
'use strict';

const path = require('path');
const { app, Menu, Tray } = require('electron');
const Config = require('../config.js')
const Utils = require('../utils')
const platform = Utils.platform
const baseDir = path.join(__dirname, '../../res');

class AppTray {
    constructor(rceWindow, locale) {
        this.rceWindow = rceWindow;
        this.blink = null
        this.createTray(locale);
    }

    createTray(locale) {
        let iconFile = platform.darwin ? Config.MAC.TRAY : Config.WIN.TRAY

        this.tray = new Tray(path.join(baseDir, iconFile))
        this.tray.setToolTip(Config.PACKAGE.APPNAME)
        this.tray.on('double-click', () => {
            if (this.rceWindow) {
                this.rceWindow.doubleClick && this.rceWindow.doubleClick();
            }
        });
        this.tray.on('click', () => {
            if (this.rceWindow) {
                this.rceWindow.show()
            }
        })
        this.setLang(locale);

        if (platform.darwin) {
            this.tray.setPressedImage(path.join(baseDir, Config.MAC.PRESSEDIMAGE))
        }
    }

    setTitle(title) {
        this.tray.setTitle(title + '');
    }

    setImage(iconPath){
        this.tray.setImage(iconPath);
    }

    displayBalloon(title, msg) {
        var options = {
            icon: path.join(baseDir, Config.WIN.BALLOON_ICON),
            title: title,
            content: msg
        };
        this.tray.displayBalloon(options);
        this.tray.on('balloon-click', (opt) => {
            if (this.rceWindow) {
                this.rceWindow.show()
                this.rceWindow.balloonClick('balloon-click', opt)
            }
        })
    }

    showBlink(unreadCount) {
        let iconFile = [Config.WIN.TRAY_OFF,Config.WIN.TRAY]
        let flag

        if(unreadCount > 0){
            if(!this.blink){
                this.blink = setInterval(() => {
                    flag = !flag
                    this.tray.setImage(path.join(baseDir, iconFile[flag ? 1 : 0]))
                },500)
            }
        }
        else{
            if(this.blink){
                clearInterval(this.blink)
            }
            this.blink = null
            this.tray.setImage(path.join(baseDir, iconFile[1]))
        }
    }

    reset() {
        if (platform.darwin){
            this.tray.setImage(path.join(baseDir, Config.MAC.TRAY))
        } else if (platform.win32){
            this.showBlink(0)
        }
    }

    setLang(locale) {
        if (platform.win32 || platform.linux) {
            let mainWindow = this.rceWindow;
            let isTopWin = mainWindow.isAlwaysOnTop();
            let trayMenu = Menu.buildFromTemplate([{
                label: locale.__('winTrayMenus.Open'),
                click () {
                    if (mainWindow) {
                        mainWindow.show()
                    }
                }
            }, 
            {
                label: locale.__('winTrayMenus.BringFront'),
                type: 'checkbox',
                checked: isTopWin,
                click () {
                    isTopWin = mainWindow.isAlwaysOnTop();
                    app.emit('menu.view.bringFront', !isTopWin)
                }
            }, 
            {
                type: 'separator'
            }, {
                label: locale.__('winTrayMenus.Exit'),
                click () {
                    // app.quit()
                    mainWindow.clearAllListeners()
                    app.exit(0)
                }
            },{
                label: 'test',
                submenu: [
                    {label: 'Item1', type: 'radio'},
                    {label: 'Item2', type: 'radio'},
                    {label: 'Item3', type: 'radio', checked: true, click: () => { console.log('22222') }},
                    {label: 'Item4', type: 'radio'}
                ]
            }, {
                label: 'test2',
                type: 'normal',
                click: (item) => {
                    console.log(item.checked);
                    console.log('333333');
                }
            }])
            this.tray.setContextMenu(trayMenu)
        }
    }
}

module.exports = AppTray;
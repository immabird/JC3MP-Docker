'use strict';

global.freeroam = {
    commands: jcmp.events.Call('get_command_manager')[0],
    chat: jcmp.events.Call('get_chat')[0],
    config: require('./gm/config'),
    utils: require('./gm/utility'),
    colours: require('./vendor/randomColor'),
    workarounds: require('./gm/_workarounds'),
    bans: new Set(),
    passiveModeBans: new Set(),
    timeManager: new (require('./gm/timeManager'))(13, 0),
    groupManager: new (require('./gm/groupManager'))(),
    poiManager: new (require('./gm/poiManager'))()
};

// temp
/*freeroam.chat.addCustomCSS(`
#chat>#chat-box {
    background:none!important;
}
`);*/

// add custom CSS
freeroam.chat.addCustomCSS(`
.admin-logo {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAqCAYAAAAu9HJYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAButJREFUeNrMmFuMlVcVx39r7e879xmGS4bCFFQooIJgqtFHG1+stU18MLYxqbGVBqgPNbEaw5MmpsRbojF4qYkkxPSl6Ys0VhPTmBpSawmJFLBluHXKbRiYYTpzLt9l7+XDGegU5pw54FBZyX76vrXWf6/bXmvJ+MsDVNc3CFNKOloGFzAFnfb0LZmGT9MTmRemX+9fHtLweYn4W99np8fEWW/MB2BqvEaoOQQgDRTuytD+QOutKtqVWemZxBkYuxB9DpFnegbYg56OnyUystGYvB71pKd1snhvyOVRUbBcv948WdrSC182HZFdiJHIbuEOAqGp5JMRzGMUS4X0cuFpjPaNjEI2Hj/tG475Tj4ZEZqKSGf5Xc2khcDU8SrF5S3Edf4vOV/4TJh2D2jB3nN9Sx+cOlC7V0QOdrycGeaEaqHe1Qjz+lIdNI+VMe181VB3WyWyRdd5YkAdT4iwoyOfWVe5PYMEyC7F4BWxGwWa2BacfUXmDBz7qhF2A4fnYFyovHovcyUyJAo3HI1sqyiLO3AuAdnK/0i9FRkDxEA8kAP+6llvYt/oziuPm8haE+HaQdqZuaAgr+kTSq46S5n7NkhtHrY+C/IUXsALZSsh4XZY8n354GYswUdRHu5RydeAdSKguNvk7us8bygmsg1jSY9sS01sm1zLZFtAkPY+YQ4oAf3Ag4I8fBNhhSKPiPElg74ZOa6DnrlLkDibDXcAWGwii33slgH3AOtmzvqmNVapULypyG/TUDDb17BGS5B3gGHgmMBwiN0JExkDJoArwBV0Bhcg438f2FBclnzBUh300/HdiK1GbJUhq0EKcpOuuRUyETBLBBtB5Ay5jbg+f0aK4aIfK70kk6/277VMHgUQ5Y4hm6kAEtsetYnolAhIxB1FEoEI+El3Qhv7F69NT1SQqwX7jkBoECAbrtD6x5J1GtRez46XSN6s3mJRWmDS9rue/KdKcrKMqb2mpvIrQ3+QniqRHKlBAPT/ZFFtWzA5WiU/XTKDnab8VoGA8EPMduZvlyw5UoUgHzxQNcQL6eEa2dslH8R/F2EXYNHVLhxsl9eQMVL+iZhIYeP0jOk/IBfnQutwjfxsyYvad4LYL6+mSHTdbX4mYnn6TvHnFtDipun2H+H2A0zeqJGdKwTT7ClR3T3bOHp9+xDE/wIXduRnS0nrUB+W3UbXq2GZ0Pp3jexcsRkjT0RBdl/fD+tcDUQk8qyGdIc/X6wnh2pYqjf/CM7fTmGpkhzqIx8tToXgt6sU/jBXfGnnYT/fk7uwPTtfqKfD5YWvoWKkw1X8aHEqa7HNt8LeTgkQhbprf/MQonanGFCsqUyF+I99oZI4TX4PLFpwU2o+2T8RvlkPlRfqlaxzFzTw0Fjbk8EwbYNUBPKcOKrTb/3PJ0nrSQty30JjLPXVD1TPpi9MDfa3Yz9WzGa6/iDtYU1BrAcvTv2rdtRS97EFjUsBWuGNaJTNWVTEa07kHGYeU8HMkBmFUX1/ZT5xiwxduuCJY0BRB/MPhaqzZt2ZYORzJkmUh8J84jaIWuU2VckKQTcE9CBdBovI8nlNtEViqyy4JduIqpbLZuBg1/Fh4L6JrnLqR6sb87FYJe4heGev+/z8t7JcNFqabq5uanafcZKx4nyChuadQrVd9/zlGD8e45ZkuKVZOzvDfE8iQ/nF7v1h1DxS7va9JLENSqdnsV2vCNOO7HQJf6FIaDi04nF3JcQfbqE13wZqc69v/HQ82DgSFYGk87TY5aairBIYmrPvA6ylZCNl8jMlQkMxtcPE/i8+kfvDqfImP1okWtUiXtVESjOKwnVhILLSIh1CONkRZDyYdF7pNXRNaMZ3S8GuWUIiI7SU/HyR7HSJkMSgDIuGPUb4NcgkEn5kTr4VgnssPVW5Jz9bIP5Ii2hFgpYCs5PVzFaHjDVdQVY/0ey28ltRP1QoCjNzuYd0pIQfKeEnYkKsE8WR+m9cI9/T2Nh3fJbDJinqM+VD7z7va/FjyerKdjsSLfbn2paNViTt1YCBCCWJbWX35cCrccdiG0JUYMaK/lJMdrJMPh5jQZo4nhsoXPxpNureKlzKqX+yH5nlFIuF4qnWcD7od5bXTu+9ki/7XrgcP+KvxOXsbJHCmiZuadreK3mJ6LqOfuVzHXzt8Ho5SZa8g6Yx2cUCBFpqvNR07scBXotJyKIqFuuNiWFtoBYJsaZvZi15XJw9W4rs+/5SfH9rPC5Gy1MoBPy7Lu0Oct+xjo+rrcRlG2tobojwomG/i/LoxaslyXqs8Ff/E/inU/lyMP+QwPb0fOEBbZci6+7u/SOds/vj1T/xqaEnrZ5fUOOvGI2F6CpF2Af2srjwxWCyNOThz93+/+8An0szTQtzgyYAAAAASUVORK5CYII=');
  background-size: cover;
  margin-top: 4px;
  width: 14px;
  height: 14px;
  margin-right: 4px;
  float: left;
}

.admin-logo.large {
  width: 24px;
  height: 24px;
  margin-top: 4px;
  margin-right: 8px;
  float: left;
}

.group-message {
  font-size: 16px;
}`)

process.on('uncaughtException', e => console.error(e.stack || e));

// load all commands from the 'commands' directory
freeroam.commands.loadFromDirectory(`${__dirname}/commands`, (f, ...a) => require(f)(...a));

// load all event files from the 'events' directory
freeroam.utils.loadFilesFromDirectory(`${__dirname}/events`);

freeroam.timeManager.start();
freeroam.groupManager.setRestrictedNames(freeroam.config.groupRestrictedNames);

setInterval(() => {}, 500);

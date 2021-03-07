import * as $ from 'jquery';

$(function() {
    (async function() {
        try {
            const port = await (navigator as any).serial.requestPort();
            await port.open({ baudRate: 9600 });
            console.log("接続");
          } catch (e) {
            console.log("Error");
          }
    })();
});

import React from 'react';

let webworker;

export default function Excel2json() {
	const complete = (res) => {
		console.log('res', res);
		return res;
	};
	const onChange = (event) => {
		console.log('ee', event.nativeEvent.target.files[0]);
		return worker(event.nativeEvent.target.files[0])
			.then(check)
			.then(complete)
			.catch((errMsg) => {
				return errMsg.message;
			});
	};

	React.useEffect(() => {
		return () => {
			if (webworker) {
				console.log('close');
				webworker.terminate();
			}
		};
	});
	return <input type="file" onChange={onChange} />;
}

function worker(file) {
	return new Promise((r, j) => {
		const js = `
importScripts('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.1/xlsx.full.min.js');
self.onmessage = function(event) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
        let binary = '';
        const bytes = new Uint8Array(e.target.result);
        const length = bytes.byteLength;
        for (let i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        const workbook = XLSX.read(binary, {
            type: 'binary',
        });
        const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(firstWorksheet, {
            blankrows: false,
            defval: '',
        });
        postMessage(data)
    };
    fileReader.readAsArrayBuffer(event.data);
}
`;
		const blob = new Blob([js], { type: 'text/plain' });
		webworker = new Worker(URL.createObjectURL(blob));

		webworker.onmessage = (event) => {
			console.log('success', event.data);
			r(event.data);
		};

		webworker.onerror = (e) => {
			console.log('error', e);
			j(e);
		};
		webworker.postMessage(file);
	});
}

function check(res) {
	if (!Array.isArray(res)) {
		throw new Error('格式错误');
	}
	return res;
}

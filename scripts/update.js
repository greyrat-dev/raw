const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../../domains');
const reserved = require('../../util/reserved.json');

let combinedArray = [];

for (const subdomain of reserved) {
	combinedArray.push({
		owner: {
			username: 'greyrat-dev',
		},
		record: {
			URL: 'https://greyrat.dev/reserved',
		},
		domain: `${subdomain}.greyrat.dev`,
		subdomain: subdomain,
		reserved: true,
	});
}

fs.readdir(directoryPath, function (err, files) {
	if (err) throw err;

	files.forEach(function (file) {
		const filePath = path.join(directoryPath, file);

		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) throw err;

			const dataArray = [JSON.parse(data)];

			for (const item of dataArray) {
				item.domain = path.parse(file).name + '.greyrat.dev';
				item.subdomain = path.parse(file).name;

				delete item.owner.email;
			}

			combinedArray = combinedArray.concat(dataArray);

			if (combinedArray.length === files.length + reserved.length) {
				fs.writeFile('raw/index.json', JSON.stringify(combinedArray), err => {
					if (err) throw err;
				});
			}
		});
	});
});

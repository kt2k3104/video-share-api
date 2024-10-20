import * as fs from 'fs';

export function readJSONFile(filePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (parseErr) {
        reject(parseErr);
      }
    });
  });
}

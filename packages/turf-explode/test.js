const fs = require('fs');
const path = require('path');
const tape = require('tape');
const fixtures = require('geojson-fixtures').all;
const load = require('load-json-file');
const write = require('write-json-file');
const explode = require('.');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

// Build test input fixtures
if (process.env.REGEN) {
    for (const name of Object.keys(fixtures)) {
        write.sync(directories.in + name + '.json', fixtures[name]);
    }
}

// Test input fixtures
tape('explode - geojson-fixtures', t => {
    for (const filename of fs.readdirSync(directories.in)) {
        const name = filename.replace('.json', '');
        const features = load.sync(directories.in + filename);
        const exploded = explode(features);
        if (process.env.REGEN) { write.sync(directories.out + filename, exploded); }
        t.ok(exploded, name);
    }
    t.end();
});

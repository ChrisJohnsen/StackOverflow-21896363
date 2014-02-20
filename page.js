function so21896363() {
/*
/* Posted Code Starts Here
 */
var fileHandler = function () {

    var _entry = null;

    this.open = function(cb){

        chrome.fileSystem.chooseEntry({ type: 'openDirectory' }, 
        function(dirEntry) {

            if (!dirEntry || !dirEntry.isDirectory) {
                cb && cb(null);
                return;
            }

            _entry = dirEntry;

            listDir(_entry, cb);
        });


    };

    this.save = function(filename, source) {

        chrome.fileSystem.getWritableEntry(_entry, function(entry) {

            entry.getFile(filename, {create:true}, function(entry) {
                entry.createWriter(function(writer) {

                    writer.onwrite = function() {
                        writer.onwrite = null;
                        writer.truncate(writer.position);
                    };

                    writer.write(new Blob([source], {type: 'text/javascript'}));
                });
            });

        });

    };

    this.saveAs = function(filename, source) {

        chrome.fileSystem.chooseEntry({type:'openDirectory'}, 
        function(entry) {

            chrome.fileSystem.getWritableEntry(entry, function(entry) {

                entry.getFile(filename, {create:true}, function(entry) {
                    entry.createWriter(function(writer) {

                        writer.onwrite = function() {
                            writer.onwrite = null;
                            writer.truncate(writer.position);
                        };

                        writer.write(new Blob([source], {type: 'text/javascript'}));
                    });
                });

            });
        });

    };

    var listDir = function(dirent, cb, listing) {
        if (listing === undefined) {
            listing = [];
        }

        var reader = dirent.createReader();

        var read_some = reader.readEntries.bind(reader, 
        function(ents) {

            if (ents.length === 0) {
                return cb && cb(listing);
            }

            var process_some = function (ents, i) {

                for (; i < ents.length; i++) {
                    listing.push(ents[i]);

                    if (ents[i].isDirectory) {
                        return listDir(ents[i], process_some.bind(null, ents, i + 1), listing);
                    }
                }

                read_some();
            };

            process_some(ents, 0);

        }, function() {
            console.error('error reading directory');
        });

        read_some();
    };

};
/*
 * Posted Code Ends Here
 */

/*
 * Added Code Starts Here
 */
var fh = new fileHandler();
fh.open(function(listing) {
    console.log('opened', listing.map(function(e){return e.fullPath}).join('\n'));
    fh.save('existing_dir/maybe_new_file','Some small data');
});
/*
 * Added Code Ends Here
 */
}

so21896363();

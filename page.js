function so21896363() {
/*
/* Posted Code Starts Here
 */
var fileHandler = {
    entry: null,
    open: function(cb){
        // capture this so we can refer to it in the chooseEntry callback
        var self = this;

        chrome.fileSystem.chooseEntry({ type: 'openDirectory' }, 
        function(dirEntry) {

            if (!dirEntry || !dirEntry.isDirectory) {
                cb && cb(null);
                return;
            }

            self.entry = dirEntry;
            cb && cb(self.entry);
        });


    },

    save: function(filename, source) {

        chrome.fileSystem.getWritableEntry(this.entry, function(entry) {

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

    },

    saveAs: function(filename, source) {

        chrome.fileSystem.chooseEntry({type:'openDirectory'}, 
        function(entry) {

            chrome.fileSystem.getWritableEntry(entry, function(entry) {

                entry.getFile(filename, {create:true}, function(entry) {
                    entry.createWriter(function(writer) {
                        writer.write(new Blob([source], {type: 'text/javascript'}));
                    });
                });

            });
        });

    }
}
/*
 * Posted Code Ends Here
 */

/*
 * Added Code Starts Here
 */
function list_dir(dirent, cb, listing) {
    if (listing === undefined) listing = [];
    var reader = dirent.createReader();
    var read_some = reader.readEntries.bind(reader, function(ents) {
        if (ents.length === 0)
            return cb && cb(listing);
        process_some(ents, 0);
        function process_some(ents, i) {
            for(; i < ents.length; i++) {
                listing.push(ents[i]);
                if (ents[i].isDirectory)
                    return list_dir(ents[i], process_some.bind(null, ents, i + 1), listing);
            }
            read_some();
        }
    }, function() {
        console.error('error reading directory');
    });
    read_some();
}

fileHandler.open(function(ent) {
    console.log('opened', ent);
    ent && list_dir(fileHandler.entry, function(listing) {
        fileHandler.listing = listing;
        console.log('listing', fileHandler.listing.map(function(ent){return ent.fullPath}).join('\n'));
        fileHandler.save('existing_dir/maybe_new_file','Some small data');
    });
});
/*
 * Added Code Ends Here
 */
}

so21896363();

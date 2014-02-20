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

            var reader = self.entry.createReader();
            reader.readEntries(function(entries) {
              for (var i = 0; i < entries.length; ++i) {
                console.log("entry is " + entries[i].fullPath);
              }
            }, function(){
                console.log("error");
            });

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
fileHandler.open(function(ent) {
    console.log('opened', ent);
    fileHandler.save('existing_dir/maybe_new_file','Some small data');
});
/*
 * Added Code Ends Here
 */
}

so21896363();

function so21896363() {
/*
/* Posted Code Starts Here
 */
var fileHandler = {
    entry: null,
    open: function(cb){

        chrome.fileSystem.chooseEntry({ type: 'openDirectory' }, 
        function(dirEntry) {

            if (!dirEntry || !dirEntry.isDirectory) {
                cb && cb(null);
                return;
            }

            this.entry = dirEntry;

            var reader = this.entry.createReader();
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
}

so21896363();

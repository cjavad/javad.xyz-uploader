var fs = require("fs");
var multer = require('multer');

var createHtmlTable = (tabledata) => {
    var html =" ";
    for (let i = 0; i < tabledata.length; i++) {
        html += ' <tr><td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-bottom: 1px solid #eee; padding: 5px;" valign="top">'+tabledata[i].url+'</td><td class="receipt-figure" style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-bottom: 1px solid #eee; padding: 5px; text-align: right;" valign="top" align="right"><img src="'+tabledata[i].thumbnail+'"></td></tr> ';
    }
    return html; 
}

var direct = [
    'avi', 'css', 'pptx',
    'csv', 'dbf', 'doc',
    'dwg', 'exe', 'docx',
    'html', 'iso', 'jpg',
    'js', 'json', 'mp3',
    'mp4', 'pdf', 'png',
    'ppt', 'psd', 'rtf',
    'search', 'svg', 'txt',
    'xls', 'xml', 'zip', 'xlsx'
]

var thumbnail = (filename) => {
    var extension = filename.split(".").pop();

    if (direct.includes(extension)) {
        return extension + ".png"
    } else {
        return "file.png"
    }
}


module.exports = (app, filedir) => {
    var storage = multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, filedir);
        },
        filename: (req, file, callback) => {
            callback(null, file.originalname);
        }
    });

    var upload = multer({
        storage: storage
    }).any();

    app.post('/u', (req, res) => {
        upload(req, res, (err) => {
            if (err) {
                return res.end("{}");
            }
            var response = {
                files: []
            }

            req.files.forEach(element => {
                var host = req.protocol + "://" + req.get('host');
                var url = host + "/f/" + element.originalname;
                response.files.push({
                    thumbnailUrl: "/images/u/icons/" + thumbnail(element.originalname),
                    name: element.originalname,
                    url: url,
                    deleteType: "DELETE",
                    type: element.mimetype,
                    deleteUrl: url,
                    size: element.size
                })
            });

            res.end(JSON.stringify(response));
        });
    });

    app.get("/f", (req, res) => {
        let data = [];
        var base_url = "/f/";
        // list all files in directory
        fs.readdir(filedir, (err, files = []) => {
            // loop over ids and create a base html list with objects
            for (let i = 0; i < files.length; i++) {
                var filename = files[i];
                data.push({
                    url: "<a href='" + base_url + filename + "'>" + filename + "</a>",
                    thumbnail: "/images/u/icons/" + thumbnail(filename)
                });
            }
            res.header("Content-Type", "text/html");
            // render url-browser with a html-list (converted)
            res.render("browse", {
                list: createHtmlTable(data),
                total: data.length,
                name: "f"
            });
        });

    });

    app.get("/f/:filename", (req, res) => {
        var filename = req.params.filename;
        var path = filedir + filename;

        fs.access(path, fs.F_OK, (err) => {
            if (err) {
                res.status(404)
                    .redirect("back");
            } else {
                res.status(200)
                    .sendFile(path);
            }
        });
    });

    app.delete("/f/:filename", (req, res) => {
        var filename = req.params.filename;
        var path = filedir + filename;

        fs.access(path, fs.F_OK, (err) => {
            if (err) {
                res.status(404)
                    .redirect("back");
            } else {
                fs.unlink(path, (err) => {
                    if (err) {
                        res.status(500).end("{}");
                    } else {
                        res.status(200).end("{}");
                    }
                });
            }
        });
    });
}
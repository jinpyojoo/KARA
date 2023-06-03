pick = async () => {
    let folder = document.getElementById('input-box').value;
    let file_div = document.getElementById('file-name');
    let random_filename = await eel.pick_file(folder)();
}

fileParser = () => {
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            load_music(evt.target.result)
            return "OK"
        }
        reader.onerror = function (evt) {
            return "ERROR"
        }

    }
}

ms = document.getElementById('music_select')
ms.addEventListener('change', (e) => {
    file = e.target.files[0]
    fileParser(file)
})
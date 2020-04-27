$.fn.multipleUploader = function (filesToUpload) {
  $(this).change(function (evt) {
    fillGrid.call(this, evt.target.files);
  });

  $(this).on('click', '.files-grid__remove', function (e) {
    e.preventDefault();

    var fileId = $(this).data('file-id');

    for (var i = 0; i < filesToUpload.length; ++i) {
      if (filesToUpload[i].id === fileId)
        filesToUpload.splice(i, 1);
    }

    $(this).parent().remove();
  });

  function fillGrid(files) {
    var items = [];

    for (var i = 0; i < files.length; i++) {
      var fileId = i;
      var file = files[i];

      filesToUpload.push({
        id: fileId,
        file: file
      });

      var removeLink = `
        <a class="files-grid__remove" href="#" data-file-id="` + fileId + `">
          <i class="fa fa-times" aria-hidden="true"></i>
        </a>`;

      items.push(`
        <div class="files-grid__item"> 
          ` + removeLink + `
          <div class="files-grid__icon mx-auto">
            <i class="fa fa-file fa-4x" aria-hidden="true"></i>
          </div>
          <div class="files-grid__name mx-auto">` + file.name + `</div>
        </div>`);

    };

    $(this).find('.files-grid').append(items);
  }

  //Remove all grid items, clear filesToUpload array
  this.clear = function () {
    filesToUpload.length = 0;

    $(this).find('.files-grid__item').remove();
  }

  //Drag'n'Drop
  var droppedFiles = false;
  $(this).on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
  })
  .on('dragover dragenter', function() {
    $(this).find('.files-grid').addClass('is-dragover');
  })
  .on('dragleave dragend drop', function() {
    $(this).find('.files-grid').removeClass('is-dragover');
  })
  .on('drop', function(e) {
    droppedFiles = e.originalEvent.dataTransfer.files;
    fillGrid.call(this, droppedFiles);
  });

  return this;
};

//Init
(function () {
  var filesToUpload = [];
  var uploader = $('.uploader-container').multipleUploader(filesToUpload);
  var loader = $('#loader');

  $('button[type="submit"]').click(function (e) {
    e.preventDefault();
    if (filesToUpload.length == 0) return;
    loader.show();

    var formData = new FormData();

    for (var i = 0; i < filesToUpload.length; i++) {
        formData.append("file_uploads[]", filesToUpload[i].file);
    }

    $.ajax({
      url: "",
      data: formData,
      processData: false,
      contentType: false,
      type: "POST",
      success: function (data) {
        alert("DONE");
        loader.hide();
        uploader.clear();
      },
      error: function (data) {
        alert("ERROR - " + data.responseText);
        loader.hide();
      }
    });
  });
})()
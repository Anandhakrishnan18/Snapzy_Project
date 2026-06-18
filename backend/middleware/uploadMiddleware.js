const multer =
  require("multer");

const path =
  require("path");

const storage =
  multer.diskStorage({

    destination:
      function (
        req,
        file,
        cb
      ) {

        cb(
          null,
          "uploads/"
        );

      },

    filename:
      function (
        req,
        file,
        cb
      ) {

        cb(
          null,
          Date.now() +
            path.extname(
              file.originalname
            )
        );

      },

  });

const fileFilter =
  (
    req,
    file,
    cb
  ) => {

    const allowed =
      /jpg|jpeg|png|gif|mp4|mov|webm/;

    const ext =
      allowed.test(
        path
          .extname(
            file.originalname
          )
          .toLowerCase()
      );

    if (ext) {

      return cb(
        null,
        true
      );

    }

    cb(
      new Error(
        "Only images and videos allowed"
      )
    );

  };

module.exports =
  multer({
    storage,
    fileFilter,
  });
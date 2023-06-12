const { Photo } = require("../models/index");
const AppError = require("../utils/app-error");
/**
 * @param {Response} res - Object of Response(Server-to-client)
 * @param {Request} req - Object of Request(Client-to-Server)
 * @param {NextFunction} next - will executes the next middleware in middleware stack.
 */

class PhotoController {
  async getAllPhotos(req, res, next) {
    const { id } = req.user;

    const result = await Photo.findAll({
      where: {
        UserId: id,
      },
    });

    res.status(200).send({
      status: "success",
      total: result.length,
      data: {
        photo: result,
      },
    });
  }

  async createPhoto(req, res, next) {
    const { title, caption, poster_image_url } = req.body;

    //create data

    const result = await Photo.create({
      UserId: req.user.id,
      poster_image_url,
      title,
      caption,
    });

    res.status(201).send({
      status: "success",
      message: "Photo has been created",
      data: {
        photo: result,
      },
    });
  }

  async deletePhoto(req, res, next) {
    const { id: userId } = req.user;
    const { photoId } = req.params;
  
    const result = await Photo.destroy({
      where: {
        id: photoId,
        UserId: userId,
      },
    });
  
    if (result === 0) {
      return next(new AppError("Data not found or you don't have permission to delete the photo", 404));
    }
  
    res.status(200).send({
      status: "success",
      message: "Your photo has been successfully deleted",
    });
  }
  
  async updatePhoto(req, res, next) {
    const { caption, title, poster_image_url } = req.body;
    const { photoId } = req.params;
  
    // From Auth Middleware
    const { id: UserId } = req.user;
  
    // Update data
    const [rowsAffected, [updatedPhoto]] = await Photo.update(
      {
        caption,
        title,
        poster_image_url,
      },
      {
        where: {
          id: photoId,
          UserId,
        },
        returning: true, // Mengembalikan data yang diperbarui
        individualHooks: true,
      }
    );
  
    if (rowsAffected === 0) {
      return next(new AppError("Data not found", 404));
    }
  
    res.send({
      status: "success",
      data: {
        photo: updatedPhoto,
      },
    });
  }
  
}

module.exports = new PhotoController();

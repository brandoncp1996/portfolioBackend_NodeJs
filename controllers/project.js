'use strict'

const project = require('../models/project');
// Varianle para tomar el modelo de documento ya hecho
var Project = require('../models/project');
var fs = require('fs');
var path = require('path'); //Para las rutas de las imagenes

//---
/*
const multer = require('multer');
 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/users/')
    },
    filename: function (req, file, cb) {
        cb(null, "user" + Date.now() + file.originalname);
    }
  });
 
const upload = multer({ storage: storage });
 
router.post('/upload-avatar', [md_auth.authenticated, upload.single('file0')], UserController.uploadAvatar);
*/
//---

var controller = {

    home: function(req, res){
        return res.status(200).send({
            message: 'Soy la home'
        });
    },

    test: function(req, res){
        return res.status(200).send({
            message: "Soy el metodo o accion test del controlador de project"
        });
    },
    
    saveProject: function(req, res){

        var project = new Project();

        var params = req.body;
        project.name = params.name;
        project.description = params.description;
        project.category = params.category;
        project.year = params.year;
        project.langs = params.langs;
        project.image = null;

        /*
        return res.status(200).send({
            project: project,
            message: "metodo saveProject"
        });
        */
        
        // ****** Nota: Esta es la nueva version de como funciona el programa (con then() y catch())

        project.save().then((projectStored) => {

            return res.status(200).send({project: projectStored});
    
        })
        .catch((error) => {
            if (!projectStored)
              return res
                .status(404)
                .send({ message: "no se ha podido guardar el proyecto" });
     
            if (error)
              return res
                .status(500)
                .send({ error: "Error al guardar el proyecto" });
          });

          
    },

    //Obtener informacion de la base de datos

    getProject: function(req, res){
        
        var projectId = req.params.id;

        if(projectId == null) return res.status(404).send({message: 'El proyecto no existe.'})
        
        Project.findById(projectId)
            .then((project) => {
                if(!project){
                    return res.status(500).send({message: 'Error al devolver los datos.'});
                }
                return res.status(200).send({project})
            })
            .catch((err) => {
                return res.status(500).send({message: 'Error al devolver los datos.'});
            })

    },

    // Obetener todo del listado de documentos que tengo en la base de datos

    getProjects: function(req, res){

        Project.find()
               .sort('-year') 
               .then((projects) => {

                    return res.status(200).send({projects});

               })
               .catch((err) => {

                if (err)
                return res
                  .status(404)
                  .send({ message: "no se ha podido guardar el proyecto" });
       
                if (!projects)
                return res
                  .status(500)
                  .send({ message: "Error al guardar el proyecto" });
                    

               });

    },

    //Actualizar datods de un documento en especial referenciado por id

    updateProject: function(req,res){

        var projectId = req.params.id;
        var update = req.body;

        Project.findByIdAndUpdate(projectId, update, {new:true})
               .then((projectUpdated) => {
                return res.status(200).send({projectUpdated});
               }) 
               .catch((err) => {

                if (err)
                return res
                  .status(500)
                  .send({ message: "Error al actualizar" });
       
                if (!projects)
                return res
                  .status(404)
                  .send({ message: "No existe el proyecto" });
                    

               });
    },

    deleteProject: function(req, res){

        var projectId = req.params.id;

        Project.findByIdAndDelete(projectId)
               .then((projectRemove) => {
                    return res.status(200).send({project: projectRemove});
               })
               .catch((err) => {

                if (err)
                return res
                  .status(500)
                  .send({ message: "No se ha podido borrar el mensaje" });
       
                if (!projectRemove)
                return res
                  .status(404)
                  .send({ message: "No se puede eliminar el documento" });
    
               });

    },

    uploadImage: function(req, res){
        
        var projectId = req.params.id;
        var fileName = 'Image no subida...'

        if(req.files){
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('/');
            var fileName = fileSplit[1];
            var extSplit = fileName.split('\.');
            var fileExt = extSplit[1];

            if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt== 'gif'){

                Project.findByIdAndUpdate(projectId, {image: fileName}, {new: true})
                   .then((projectUpdated) => {
                        return res.status(200).send({project: projectUpdated});
                   })
                   .catch((err) => {

                    if (err)
                    return res
                      .status(500)
                      .send({ message: "La imagen no se ha subido" });
           
                    if (!projectRemove)
                    return res
                      .status(404)
                      .send({ message: "El proyecto no existe y no se ha guardado la imagen" });
        
                   });

            } else {

                fs.unlink(filePath, (err) => {
                    return res.status(200).send({message: "Le extencion no es valida"});
                });

            }
            
        }
        else {
            return res.status(200).send({
                message: fileName
            });
        } 
    },

    getImageFile: function(req,res){
        var file = req.params.image;
        var path_file = './uploads/'+file

        fs.exists(path_file, (exist) => {
            if(exist){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(200).send({
                    message: "No existe la imagen..."
                })
            }
        });
    }
    

};

module.exports = controller;


class PortofolioController {
    
   static async getPortofolio(req, res, next) {

        try {

            res.status(200).json({message: 'Portofolio data'});

        } catch (error) {
            
            next(error);

        }

   }     

}   


module.exports = PortofolioController;
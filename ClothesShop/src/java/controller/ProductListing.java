package controller;

import com.google.gson.Gson;
import dto.Response_DTO;
import dto.User_DTO;
import entity.Brand;
import entity.Category;
import entity.Color;
import entity.Product;
import entity.Product_Status;
import entity.Size;
import entity.User;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.HibernateUtil;
import model.Validations;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

@MultipartConfig
@WebServlet(name = "ProductListing", urlPatterns = {"/ProductListing"})
public class ProductListing extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Response_DTO response_DTO = new Response_DTO();
        Gson gson = new Gson();

        String title = request.getParameter("title"); 
        String categoryId = request.getParameter("categoryId");
        String brandId = request.getParameter("brandId");
        String description = request.getParameter("description");
        String price = request.getParameter("price");
        String quantity = request.getParameter("quantity");
        String colorId = request.getParameter("colorId");
        String sizeId = request.getParameter("sizeId");

        Part image1 = request.getPart("image1");
        Part image2 = request.getPart("image2");
        Part image3 = request.getPart("image3");

        Session session = HibernateUtil.getSessionFactory().openSession();

        if (title.isEmpty()) {
            response_DTO.setContent("Please add title.");
        } else if (!Validations.isInteger(categoryId)) {
            response_DTO.setContent("Invalid category.");
        } else if (!Validations.isInteger(brandId)) {
            response_DTO.setContent("Invalid brand.");
        } else if (!Validations.isInteger(colorId)) {
            response_DTO.setContent("Invalid color.");
        } else if (!Validations.isInteger(sizeId)) {
            response_DTO.setContent("Invalid size.");
        } else if (description.isEmpty()) {
            response_DTO.setContent("Please add description.");
        } else if (price.isEmpty()) {
            response_DTO.setContent("Please add price.");
        } else if (!Validations.isDouble(price)) {
            response_DTO.setContent("Invalid price.");
        } else if (Double.parseDouble(price) <= 0) {
            response_DTO.setContent("Invalid price.");
        } else if (quantity.isEmpty()) {
            response_DTO.setContent("Please add quantity.");
        } else if (!Validations.isInteger(quantity)) {
            response_DTO.setContent("Invalid quantity.");
        } else if (Integer.parseInt(quantity) <= 0) {
            response_DTO.setContent("Invalid quantity.");
        } else if (image1.getSubmittedFileName() == null) {
            response_DTO.setContent("Please upload image 1.");
        } else if (image2.getSubmittedFileName() == null) {
            response_DTO.setContent("Please upload image 2.");
        } else if (image3.getSubmittedFileName() == null) {
            response_DTO.setContent("Please upload image 3.");
        } else {

            Category category = (Category) session.load(Category.class, Integer.parseInt(categoryId));

            if (category == null) {
                response_DTO.setContent("Invalid category.");

            } else {

                Brand brand = (Brand) session.load(Brand.class, Integer.parseInt(brandId));

                if (brand == null) {
                    response_DTO.setContent("Invalid brand.");

                } else {

                    Color color = (Color) session.load(Color.class, Integer.parseInt(colorId));

                    if (color == null) {
                        response_DTO.setContent("Invalid color.");

                    } else {

                        Size size = (Size) session.load(Size.class, Integer.parseInt(sizeId));

                        if (size == null) {
                            response_DTO.setContent("Invalid size.");

                        } else {

                            Product product = new Product();
                            product.setTitle(title);
                            product.setCategory(category);
                            product.setBrand(brand);
                            product.setDescription(description);
                            product.setPrice(Double.parseDouble(price));
                            product.setQty(Integer.parseInt(quantity));
                            product.setColor(color);
                            
                            User_DTO user_DTO = (User_DTO) request.getSession().getAttribute("user");
                            Criteria criteria1 = session.createCriteria(User.class);
                            criteria1.add(Restrictions.eq("email", user_DTO.getEmail()));
                            User user = (User) criteria1.uniqueResult();
                            product.setUser(user);
                            product.setDate_time(new Date());
                            
                            Product_Status product_Status = (Product_Status) session.load(Product_Status.class, 1);
                            product.setProduct_Status(product_Status);
                            
                             product.setSize(size);

                            int pid = (int) session.save(product);
                            session.beginTransaction().commit();

                            String applicatonParth = request.getServletContext().getRealPath("");
//                            String newApplicationPath = applicatonParth.replace("build" + File.separator + "web", "web");
//                            System.out.println(newApplicationPath);
//                            System.out.println(applicatonParth);

                            File folder = new File(applicatonParth + "//product-images//" + pid);
                            folder.mkdir();

                            File file1 = new File(folder, "image1.png");
                            InputStream inputStream1 = image1.getInputStream();
                            Files.copy(inputStream1, file1.toPath(), StandardCopyOption.REPLACE_EXISTING);

                            File file2 = new File(folder, "image2.png");
                            InputStream inputStream2 = image2.getInputStream();
                            Files.copy(inputStream2, file2.toPath(), StandardCopyOption.REPLACE_EXISTING);

                            File file3 = new File(folder, "image3.png");
                            InputStream inputStream3 = image3.getInputStream();
                            Files.copy(inputStream3, file3.toPath(), StandardCopyOption.REPLACE_EXISTING);

                            response_DTO.setSuccess(true);
                            response_DTO.setContent("New Product Added.");

                        }

                    }

                }

            }

        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(response_DTO));
        System.out.println(gson.toJson(response_DTO));
        session.close();
    }

}

package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.Brand;
import entity.Category;
import entity.Color;
import entity.Product;
import entity.Size;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "SearchProducts", urlPatterns = {"/SearchProducts"})
public class SearchProducts extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

        JsonObject responseJsonObject = new JsonObject();
        responseJsonObject.addProperty("success", false);

        //get request json
        JsonObject requestJsonObject = gson.fromJson(request.getReader(), JsonObject.class);

        Session session = HibernateUtil.getSessionFactory().openSession();

        //search all products
        Criteria criteria1 = session.createCriteria(Product.class);

        //add category filter
        //category selected 
        String categoryName = requestJsonObject.get("category_name").getAsString();

        if (!categoryName.equals("Category")) {

            //get category list from Db
            Criteria criteria2 = session.createCriteria(Category.class);
            criteria2.add(Restrictions.eq("name", categoryName));
            Category categoryResult = (Category) criteria2.uniqueResult();

            //filter products by category list from DB
            criteria1.add(Restrictions.eq("category", categoryResult));
        }

        //brand selected
        String brandName = requestJsonObject.get("brand_name").getAsString();

        if (!brandName.equals("Brand")) {

            //get brand from Db
            Criteria criteria4 = session.createCriteria(Brand.class);
            criteria4.add(Restrictions.eq("name", brandName));
            Brand brandResult = (Brand) criteria4.uniqueResult();

            //filter products by brand from DB
            criteria1.add(Restrictions.eq("brand", brandResult));

        }

        //color selected
        String colorName = requestJsonObject.get("color_name").getAsString();

        if (!colorName.equals("Color")) {

            //get color from Db
            Criteria criteria5 = session.createCriteria(Color.class);
            criteria5.add(Restrictions.eq("name", colorName));
            Color colorResult = (Color) criteria5.uniqueResult();

            //filter products by color from DB
            criteria1.add(Restrictions.eq("color", colorResult));

        }

        //size selected
        String sizeName = requestJsonObject.get("size_name").getAsString();

        if (!sizeName.equals("Size")) {

            //get size from Db
            Criteria criteria6 = session.createCriteria(Size.class);
            criteria6.add(Restrictions.eq("name", sizeName));
            Size sizeResult = (Size) criteria6.uniqueResult();

            //filter products by size from DB
            criteria1.add(Restrictions.eq("size", sizeResult));

        }

        //text selected
        String searchText = requestJsonObject.get("searchText").getAsString();

        if (!searchText.isEmpty()) {
            //filter products by text from DB
            criteria1.add(Restrictions.like("title", searchText, MatchMode.ANYWHERE));
        }

        //get all product count
        responseJsonObject.addProperty("allProductCount", criteria1.list().size());

        //set product range
        int firstResult = requestJsonObject.get("firstResult").getAsInt();
        criteria1.setFirstResult(firstResult);
        criteria1.setMaxResults(6);

        //get product list
        List<Product> productList = criteria1.list();
        System.out.println(productList.size());

        //get product list
        for (Product product : productList) {
            product.setUser(null);
        }

        responseJsonObject.addProperty("success", true);
        responseJsonObject.add("productList", gson.toJsonTree(productList));

        //send response
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJsonObject));

    }

}

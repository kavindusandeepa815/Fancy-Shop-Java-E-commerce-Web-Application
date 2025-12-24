package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dto.Response_DTO;
import entity.Brand;
import entity.Category;
import entity.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import entity.Color;
import entity.Size;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;

@WebServlet(name = "LoadFeatures", urlPatterns = {"/LoadFeatures"})
public class LoadFeatures extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

        Session session = HibernateUtil.getSessionFactory().openSession();

        Criteria criteria1 = session.createCriteria(Category.class);
        criteria1.addOrder(Order.asc("name"));
        List<Category> categoryList = criteria1.list();

        Criteria criteria2 = session.createCriteria(Brand.class);
        criteria2.addOrder(Order.asc("name"));
        List<Brand> brandList = criteria2.list();

        Criteria criteria3 = session.createCriteria(Color.class);
        criteria3.addOrder(Order.asc("name"));
        List<Color> colorList = criteria3.list();

        Criteria criteria4 = session.createCriteria(Size.class);
        criteria3.addOrder(Order.asc("name"));
        List<Size> sizeList = criteria4.list();

        JsonObject jsonObject = new JsonObject();
        jsonObject.add("categoryList", gson.toJsonTree(categoryList));
        jsonObject.add("brandList", gson.toJsonTree(brandList));
        jsonObject.add("colorList", gson.toJsonTree(colorList));
        jsonObject.add("sizeList", gson.toJsonTree(sizeList));

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(jsonObject));

        session.close();

    }

}

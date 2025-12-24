package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dto.Response_DTO;
import entity.Category;
import entity.Product;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import model.Validations;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "LoadHomeProducts", urlPatterns = {"/LoadHomeProducts"})
public class LoadHomeProducts extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        Session session = HibernateUtil.getSessionFactory().openSession();

        Criteria criteria1 = session.createCriteria(Product.class);
        criteria1.addOrder(Order.desc("id"));
        criteria1.setMaxResults(8);

        List<Product> productList = criteria1.list();

        for (Product product1 : productList) {
            product1.getUser().setPassword(null);
            product1.getUser().setVerification(null);
            product1.getUser().setEmail(null);
        }

        JsonObject jsonObject = new JsonObject();
        jsonObject.add("productList", gson.toJsonTree(productList));

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(jsonObject));
        session.close();

    }

}

package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dto.Cart_DTO;
import dto.Response_DTO;
import dto.User_DTO;
import entity.Cart;
import entity.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.HibernateUtil;
import model.Validations;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "RemoveItemFromCart", urlPatterns = {"/RemoveItemFromCart"})
public class RemoveItemFromCart extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Response_DTO response_DTO = new Response_DTO();
        Gson gson = new Gson();

        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = session.beginTransaction();

        try {
            String id = request.getParameter("id");

            if (!Validations.isInteger(id)) {
                response_DTO.setContent("Invalid product ID.");
            } else {
                int productId = Integer.parseInt(id);

                if (request.getSession().getAttribute("user") != null) {
                    // Database Cart
                    User_DTO user_DTO = (User_DTO) request.getSession().getAttribute("user");

                    // Retrieve user from the database
                    Criteria criteria1 = session.createCriteria(User.class);
                    criteria1.add(Restrictions.eq("email", user_DTO.getEmail()));
                    User user = (User) criteria1.uniqueResult();

                    if (user != null) {
                        // Find the cart item for this user and product
                        Criteria criteria2 = session.createCriteria(Cart.class);
                        criteria2.add(Restrictions.eq("user", user));
                        criteria2.add(Restrictions.eq("product.id", productId));

                        Cart cartItem = (Cart) criteria2.uniqueResult();

                        if (cartItem != null) {
                            session.delete(cartItem);
                            transaction.commit();
                            response_DTO.setSuccess(true);
                            response_DTO.setContent("Product removed from the cart.");
                        } else {
                            response_DTO.setContent("Product not found in the cart.");
                        }
                    } else {
                        response_DTO.setContent("User not found.");
                    }
                } else {
                    // Session Cart
                    HttpSession httpSession = request.getSession();

                    if (httpSession.getAttribute("sessionCart") != null) {
                        ArrayList<Cart_DTO> sessionCart = (ArrayList<Cart_DTO>) httpSession.getAttribute("sessionCart");

                        Cart_DTO toRemove = null;
                        for (Cart_DTO cart_DTO : sessionCart) {
                            if (cart_DTO.getProduct().getId() == productId) {
                                toRemove = cart_DTO;
                                break;
                            }
                        }

                        if (toRemove != null) {
                            sessionCart.remove(toRemove);
                            response_DTO.setSuccess(true);
                            response_DTO.setContent("Product removed from the cart.");
                        } else {
                            response_DTO.setContent("Product not found in the session cart.");
                        }
                    } else {
                        response_DTO.setContent("Session cart is empty.");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            response_DTO.setContent("Error occurred. Please try again.");
        } finally {
            if (session.isOpen()) {
                session.close();
            }
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(response_DTO));

    }

}

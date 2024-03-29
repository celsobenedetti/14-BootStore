import dayjs from "dayjs";
import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";

const Title = styled.h1`
    font-size: 18px;
    font-weight: 700;
`;

const Orders = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;
`;

const Order = styled.div`
    padding: 0 10px;
    display: flex;
    align-items: center;

    height: 40px;
    width: 100%;
    border-radius: 5px;
    background-color: ${({ theme }) => {
        return theme.lightGray;
    }};
    :hover {
        background-color: ${({ theme }) => {
            return theme.gray;
        }};
    }

    cursor: pointer;
`;

export default function OrdersPage() {
    const { setUserPageTab } = useContext(AppContext);
    const { token, orders, setOrders, getData } = useContext(UserContext);

    const navigate = useRef(useNavigate());

    useEffect(() => {
        if (!token) {
            const localToken = JSON.parse(localStorage.getItem("bootstore_token"));
            if (!localToken) navigate.current("/");
        } else {
            setUserPageTab("orders");
            getData("orders", setOrders);
        }
    }, [token]);

    function goToOrderPage(id) {
        navigate.current(`./${id}`);
    }

    const ordersElements = orders ? (
        orders.map((order, index) => {
            const title = `${dayjs(order.date).format("DD/MM")} - ${`${order.products[0].title}${
                order.products.length > 1 ? " e outros" : ""
            }`} - $ ${order.totalAmmount}`;

            return (
                <Order
                    onClick={() => {
                        goToOrderPage(order._id);
                    }}
                    key={index}
                >
                    {title}
                </Order>
            );
        })
    ) : (
        <></>
    );

    return (
        <>
            <Title>Histórico de Pedidos</Title>
            <Orders>
                {orders
                    ? orders.length > 0
                        ? ordersElements
                        : "Você não fez nenhum pedido ainda :/"
                    : "Estamos checando os pedidos..."}
            </Orders>
        </>
    );
}

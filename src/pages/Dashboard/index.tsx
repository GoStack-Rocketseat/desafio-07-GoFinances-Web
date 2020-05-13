import React, { useState, useEffect } from 'react';
import { FiTrash } from 'react-icons/fi';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
  updated_at: Date;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  async function loadTransactions(): Promise<void> {
    const response = await api.get('/transactions');
    console.log(response.data);

    setBalance(response.data.balance);
    setTransactions(response.data.transactions);
  }

  async function handleDelete(id: string): Promise<void> {
    console.log(`click: ${id}`);

    const response = await api.delete(`/transactions/${id}`);

    // console.log(response);

    if (response.status !== 200) {
      console.log('erro deletando transação');
    }

    loadTransactions();
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          {balance ? (
            <>
              <Card>
                <header>
                  <p>Entradas</p>
                  <img src={income} alt="Income" />
                </header>
                <h1 data-testid="balance-income">
                  {formatValue(balance.income)}
                </h1>
              </Card>
              <Card>
                <header>
                  <p>Saídas</p>
                  <img src={outcome} alt="Outcome" />
                </header>
                <h1 data-testid="balance-outcome">
                  {formatValue(balance.outcome)}
                </h1>
              </Card>
              <Card total>
                <header>
                  <p>Total</p>
                  <img src={total} alt="Total" />
                </header>
                <h1 data-testid="balance-total">
                  {formatValue(balance.total)}
                </h1>
              </Card>
            </>
          ) : (
            <Card>Carregando...</Card>
          )}
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th className="right">Preço</th>
                <th>Categoria</th>
                <th>Data</th>
                <th className="actions">Ações</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length > 0 ? (
                transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td className={transaction.type}>
                      {transaction.type === 'outcome' ? ' - ' : ''}
                      {formatValue(transaction.value)}
                    </td>
                    <td>{transaction.category.title}</td>
                    <td>{formatDate(new Date(transaction.created_at))}</td>
                    <td className="actions">
                      <button
                        type="button"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        <FiTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>Nenhuma transação cadastrada</td>
                </tr>
              )}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;

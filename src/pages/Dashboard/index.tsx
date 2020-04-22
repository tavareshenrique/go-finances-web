import React, { useState, useEffect } from 'react';

// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import pt from 'date-fns/locale/pt';

import formatValue from '../../utils/formatValue';

import api from '../../services/api';

import Header from '../../components/Header';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

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
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      api.get('transactions').then(response => {
        const transactionResponse = response.data.transactions.map(
          (transaction: Transaction) => {
            return {
              ...transaction,
              formattedValue:
                transaction.type === 'outcome'
                  ? `- ${formatValue(transaction.value)}`
                  : formatValue(transaction.value),
              formattedDate: format(
                new Date(transaction.created_at),
                'dd/MM/yyyy',
                {
                  locale: pt,
                },
              ),
            };
          },
        );

        setTransactions(transactionResponse);
      });
    }

    async function loadBalance(): Promise<void> {
      api.get('transactions').then(response => {
        const balanceResponse = {
          income: formatValue(response.data.balance.income),
          outcome: formatValue(response.data.balance.outcome),
          total: formatValue(response.data.balance.total),
        };

        setBalance(balanceResponse);
      });
    }

    loadTransactions();
    loadBalance();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        {transactions && (
          <TableContainer>
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Preço</th>
                  <th>Categoria</th>
                  <th>Data</th>
                </tr>
              </thead>

              {transactions.map(transaction => (
                <tbody>
                  <tr>
                    <td className="title">{transaction.title}</td>
                    <td className={transaction.type}>
                      {transaction.formattedValue}
                    </td>
                    <td>{transaction.category.title}</td>
                    <td>{transaction.formattedDate}</td>
                  </tr>
                </tbody>
              ))}
            </table>
          </TableContainer>
        )}
      </Container>
    </>
  );
};

export default Dashboard;

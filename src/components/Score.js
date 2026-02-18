import React from 'react';
import './Score.css';

const Score = ({ rounds = [] }) => {
  if (!rounds || rounds.length === 0) {
    return (
      <div className="score-container">
        <div className="no-data">
          <p>No score data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="score-container">
      <div className="score-table-wrapper">
        <table className="score-table">
          <thead>
            <tr>
              <th>Round</th>
              <th>Par</th>
              <th>Score</th>
              <th>+/-</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {rounds.map((round, index) => (
              <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>{round.round || index + 1}</td>
                <td>{round.par || 'N/A'}</td>
                <td>{round.score || 'N/A'}</td>
                <td className={round.differential > 0 ? 'over-par' : round.differential < 0 ? 'under-par' : 'at-par'}>
                  {round.differential > 0 ? '+' + round.differential : round.differential || 0}
                </td>
                <td>{round.total || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Score;
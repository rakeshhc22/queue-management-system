import React from "react";

const TokenList = ({
  tokens,
  onMoveUp,
  onMoveDown,
  onCancel,
  onAssignTop
}) => {
  return (
    <div>
      <h3>Tokens</h3>
      {tokens.length === 0 ? (
        <p>No tokens in queue.</p>
      ) : (
        <ul>
          {tokens.map((token, index) => (
            <li key={token._id} style={{ marginBottom: "1rem" }}>
              <div>
                <strong>Token #{token.tokenNumber}</strong> - {token.name} ({token.mobile}) -{" "}
                <span style={{ fontStyle: "italic" }}>{token.status}</span>
              </div>
              <div style={{ marginTop: "0.3rem" }}>
                <button onClick={() => onMoveUp(token._id)} disabled={index === 0}>
                  🔼 Move Up
                </button>
                <button
                  onClick={() => onMoveDown(token._id)}
                  disabled={index === tokens.length - 1}
                >
                  🔽 Move Down
                </button>
                <button onClick={() => onCancel(token._id)}>❌ Cancel</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {tokens.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <button onClick={onAssignTop}>✅ Assign Top Token</button>
        </div>
      )}
    </div>
  );
};

export default TokenList;

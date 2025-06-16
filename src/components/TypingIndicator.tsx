export const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 p-2">
      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
    </div>
  );
};

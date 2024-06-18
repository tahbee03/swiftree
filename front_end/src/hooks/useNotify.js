export function useNotify() {
    async function notify(id, message, icon) {
        const notifResponse = await fetch(`${process.env.REACT_APP_API_URL}/notifications`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: id,
                message,
                icon
            })
        });
        const notifData = notifResponse.json();

        if (!notifResponse.ok) throw new Error(notifData.message);
    }

    return notify;
}
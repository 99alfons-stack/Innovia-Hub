import { useMemo, useState } from "react";

type BookingCalendarProps = {
    selectedDate: string;
    onSelectDate: (date: string) => void;
};

const weekDays = ["Må", "Ti", "On", "To", "Fr", "Lö", "Sö"];

function formatDate(year: number, month: number, day: number) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");

    return `${year}-${mm}-${dd}`;
}

export default function BookingCalendar({
                                            selectedDate,
                                            onSelectDate,
                                        }: BookingCalendarProps) {
    const selected = new Date(`${selectedDate}T00:00:00`);

    const [visibleMonth, setVisibleMonth] = useState(
        new Date(selected.getFullYear(), selected.getMonth(), 1),
    );

    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();

    const monthLabel = visibleMonth.toLocaleDateString("sv-SE", {
        month: "long",
        year: "numeric",
    });

    const days = useMemo(() => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const daysInMonth = lastDay.getDate();

        // JS: söndag = 0. Vi vill måndag = 0.
        const startOffset = (firstDay.getDay() + 6) % 7;

        return [
            ...Array.from({ length: startOffset }, () => null),
            ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
        ];
    }, [year, month]);

    function previousMonth() {
        setVisibleMonth(new Date(year, month - 1, 1));
    }

    function nextMonth() {
        setVisibleMonth(new Date(year, month + 1, 1));
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={previousMonth}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{
                        background: "#111e2d",
                        border: "1px solid #1e3347",
                        color: "#7a94aa",
                    }}
                >
                    ←
                </button>

                <div
                    className="text-sm font-semibold capitalize"
                    style={{
                        color: "#e2eaf2",
                        fontFamily: "Outfit, sans-serif",
                    }}
                >
                    {monthLabel}
                </div>

                <button
                    type="button"
                    onClick={nextMonth}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{
                        background: "#111e2d",
                        border: "1px solid #1e3347",
                        color: "#7a94aa",
                    }}
                >
                    →
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className="text-center text-xs py-1"
                        style={{ color: "#7a94aa" }}
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                    if (!day) {
                        return <div key={`empty-${index}`} />;
                    }

                    const dateValue = formatDate(year, month, day);
                    const isSelected = dateValue === selectedDate;

                    return (
                        <button
                            key={dateValue}
                            type="button"
                            onClick={() => onSelectDate(dateValue)}
                            className="aspect-square rounded-lg text-xs font-medium transition-all"
                            style={{
                                background: isSelected
                                    ? "#00d4aa"
                                    : "transparent",
                                color: isSelected
                                    ? "#080e14"
                                    : "#e2eaf2",
                                border: `1px solid ${
                                    isSelected ? "#00d4aa" : "transparent"
                                }`,
                            }}
                            onMouseEnter={(e) => {
                                if (!isSelected) {
                                    e.currentTarget.style.background = "#111e2d";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isSelected) {
                                    e.currentTarget.style.background = "transparent";
                                }
                            }}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
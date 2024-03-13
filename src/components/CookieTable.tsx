import { createSignal, type Component, For, on, onCleanup } from 'solid-js';

type CookieTableProps = {
    cookies: Record<string, string>
}

const filterCookies = (cookies: Record<string, string>, filter: string) => {
    return Object.fromEntries(
        Object.entries(cookies).filter(([name, value]) => {
            return name.includes(filter) || value.includes(filter);
        })
    );
}
const CookieTable: Component<CookieTableProps> = (props) => {
    const [selected, setSelected] = createSignal<Record<string, string>>({});
    const [search, setSearch] = createSignal('');
    const [copyStatus, setCopyStatus] = createSignal('');

    const filteredCookies = () => filterCookies(props.cookies, search())

    const onSelectedChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.checked) {
            setSelected({ ...selected(), [target.name]: props.cookies[target.name] });
        } else {
            const newSelected = { ...selected() };
            delete newSelected[target.name];
            setSelected(newSelected);
        }
    }
    const isSomeSelected = () => Object.keys(selected()).length > 0;


    const onCopy = () => {


        const text = JSON.stringify(Object.fromEntries(Object.entries(selected())));
        navigator.clipboard.writeText(text);
        setCopyStatus(`${Object.keys(selected()).length} cookies copied`);
        setTimeout(() => setCopyStatus(''), 1000);
    }

    const onCtrlC = (e: KeyboardEvent) => {
        if (e.key === 'c' && e.ctrlKey) {
            onCopy();
        }
    }

    document.addEventListener('keydown', onCtrlC);

    onCleanup(() => {
        document.removeEventListener('keydown', onCtrlC);
    });

    return (
        <div class='p-2 bg-gray-800 text-white'>
            <div
                class="flex items-center space-x-2"
            >
                <input
                    type='search'
                    placeholder='Search cookies'
                    value={search()}
                    onInput={(e) => setSearch(e.currentTarget.value)}
                    class="p-1 h-7 rounded bg-gray-700 text-white placeholder-gray-400"
                />
                <button
                    disabled={!isSomeSelected()}
                    class={`px-2 h-7 py-1 rounded text-sm font-medium ${copyStatus() ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"} disabled:bg-gray-600 disabled:cursor-not-allowed`}
                    onClick={onCopy}
                >
                    {copyStatus() || 'Copy'}
                </button>
            </div>
            <table class="table-auto w-full mt-2 text-sm">
                <thead>
                    <tr class='bg-gray-700 border-b border-gray-800'>
                        <th class="px-2 py-1  w-5 text-left"></th>
                        <th class="px-2 py-1 w-10 text-left">Name</th>
                        <th class="px-2 py-1 text-left">Value</th>
                    </tr>
                </thead>
                <tbody>
                    <For each={Object.entries(filteredCookies())}>
                        {([name, value]) => (
                            <tr class="bg-gray-700 hover:bg-gray-600">
                                <td class="px-2 py-1">
                                    <input
                                        type="checkbox"
                                        name={name}
                                        checked={!!selected()[name]}
                                        onChange={onSelectedChange}
                                        class="rounded text-blue-500"
                                    />
                                </td>
                                <td class="px-2 py-1">{name}</td>
                                <td class="px-2 py-1">{value}</td>
                            </tr>
                        )}
                    </For>
                </tbody>
            </table>
        </div>
    )
};
export default CookieTable;
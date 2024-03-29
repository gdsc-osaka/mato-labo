import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Discipline} from "@/domain/types";

export default function SelectDiscipline({name, defaultValue, disciplines}: {
    name: string,
    defaultValue?: string,
    disciplines: Discipline[]
}) {
    return (
        <div>
            <Label htmlFor={"discipline-search"}>学問分野で検索</Label>
            <Select name={name} defaultValue={defaultValue}>
                <SelectTrigger className="">
                    <SelectValue placeholder="学問分野で検索" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {disciplines.map(discipline => (
                            <SelectItem key={discipline.id} value={discipline.id.toString()}>{discipline.name}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

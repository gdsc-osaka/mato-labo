import {SearchBox} from "@/components/search";
import {UniversityRepository} from "@/repository/universityRepository";
import {GraduateSchoolRepository} from "@/repository/graduateSchoolRepository";
import {MajorRepository} from "@/repository/majorRepository";
import {LaboratoryRepository} from "@/repository/laboratoryRepository";
import {DisciplineRepository} from "@/repository/disciplineRepository";
import {LaboratoryService} from "@/service/laboratoryService";
import {LaboratoryScraper} from "@/crawler/scraper";
import {ScholarRepository} from "@/repository/scholarRepository";
import {TransactionRepository} from "@/repository/transactionRepository";
import {TagRepository} from "@/repository/tagRepository";
import {PaperRepository} from "@/repository/paperRepository";
import {Browser} from "@/crawler/browser";

const universityRepository = new UniversityRepository();
const gSchoolRepository = new GraduateSchoolRepository();
const majorRepository = new MajorRepository();
const disciplineRepository = new DisciplineRepository();
const laboRepository = new LaboratoryRepository();
const tagRepository = new TagRepository();
const paperRepository = new PaperRepository();

const scholarRepository = new ScholarRepository();
const transactionRepository = new TransactionRepository();
const laboScraper = new LaboratoryScraper(new Browser());
const laboService = new LaboratoryService(
    laboRepository,
    scholarRepository,
    paperRepository,
    transactionRepository,
    laboScraper,
);

export default function Home() {
    async function testAction() {
        'use server';

        // const univ = await universityRepository.create({
        //     institution: "PUBLIC",
        //     name: "大阪大学",
        //     url: "https://www.osaka-u.ac.jp/"
        // });
        // const gSchool = await gSchoolRepository.create({
        //     univId: univ.id,
        //     url: "https://www.ist.osaka-u.ac.jp/"
        // });
        // const major = await majorRepository.create({
        //     graduateSchoolId: gSchool.id,
        //     url: "https://www.ist.osaka-u.ac.jp/japanese/majors/nw.php"
        // });
        // const discipline = await disciplineRepository.create({
        //     name: "情報科学", type: "FORMAL"
        // });
        // const labo = await laboRepository.create({
        //     univId: univ.id,
        //     graduateSchoolId: gSchool.id,
        //     majorId: major.id,
        //     access: [],
        //     name: "先進ネットワークアーキテクチャ講座",
        //     seminarName: "村田研究室",
        //     websiteUrl: "https://www-mura.ist.osaka-u.ac.jp/",
        //     prefectureId: 27,
        //     disciplineId: discipline.id,
        //     laboType: 'DEFAULT',
        //     address: null,
        //     email: null,
        //     fax: null,
        //     paperSummary_en: null,
        //     paperSummary_ja: null,
        //     postCode: null,
        //     telNumber: null,
        // })
        // await laboService.updateLaboratory("clus5nn1m00065fkoh05m930c");

        // await tagRepository.create({id: "大阪大学"}, "clus5nn1m00065fkoh05m930c");
        await laboService.updatePaperSummary("clus5nn1m00065fkoh05m930c");
    }

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <SearchBox/>
            <form action={testAction}>
                <button type={"submit"}>Test</button>
            </form>
        </main>
    )
}

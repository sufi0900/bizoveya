import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
const root=process.cwd();
const fail=(s)=>{throw new Error(s);};
for(const relative of ["apps/web/src/app/admin","apps/web/src/app/api/admin","apps/web/src/features/admin"])if(existsSync(path.join(root,relative)))fail(`Public app includes ${relative}`);
for(const relative of ["apps/admin/src/app/workspaces","apps/admin/src/app/bizoveya","apps/admin/src/app/start","apps/admin/src/app/projects"])if(existsSync(path.join(root,relative)))fail(`Admin app includes ${relative}`);
const files=(dir)=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);
for(const file of files(path.join(root,"apps/web/src"))){if(!/\.(tsx?|mjs)$/.test(file))continue;const text=readFileSync(file,"utf8");if(/href\s*=\s*["']\/(?:admin(?:[\/"'])|api\/admin)/.test(text)||/features\/admin/.test(text))fail(`Public admin link/import: ${file}`);}
for(const file of files(path.join(root,"apps/admin/src"))){if(!/\.tsx?$/.test(file)||file.includes(".test."))continue;const text=readFileSync(file,"utf8");if(/href\s*=\s*["']\/(?:workspaces|bizoveya|projects)/.test(text))fail(`Admin public-app relative link: ${file}`);}
console.log("Application boundary checks passed: no public admin routes/APIs/imports/links; admin has no customer/docs routes.");

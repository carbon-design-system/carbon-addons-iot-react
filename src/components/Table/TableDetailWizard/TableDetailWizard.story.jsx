/* Used dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import TableDetailWizard from './TableDetailWizard';
import StatefulTableDetailWizard from './StatefulTableDetailWizard';

const items = [
  {
    id: 'step1',
    name: 'Identity',
  },
  {
    id: 'step2',
    name: 'State Model',
  },
  {
    id: 'step3',
    name: 'Notifications',
  },
  {
    id: 'step4',
    name: 'Final step',
  },
];

const itemComponents = [
  <div style={{ backgroundColor: '#eaeaea' }}>
    <div>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Excepturi, corrupti laboriosam,
      culpa similique quae dolorum provident vitae iusto at velit dignissimos reiciendis maiores
      voluptate fugit dolore harum unde laborum facilis! Lorem ipsum dolor sit amet consectetur
      adipisicing elit. Et soluta placeat explicabo! Necessitatibus id neque accusantium molestiae
      officiis ducimus! Suscipit quae perferendis officiis vel, magnam est error! Vel, accusantium
      quas enim inventore natus adipisci autem at modi dolores assumenda mollitia ut facilis,
      deleniti aspernatur? Fuga at in expedita tempora cum quasi nemo neque alias id ullam omnis
      similique placeat provident, eum totam itaque perferendis, reiciendis laboriosam ducimus sunt
      facilis amet? Cupiditate voluptatem et, voluptas maxime sunt possimus repudiandae nisi
      necessitatibus?
    </div>
  </div>,
  <div style={{ padding: '70px 30px', backgroundColor: '#dceadd' }}>
    <div>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum mollitia repellendus assumenda
      fuga inventore nisi, minus optio ullam voluptas eveniet dolore dolorem vitae, neque suscipit
      labore at. Voluptatum, nobis perferendis!
    </div>
  </div>,
  <div style={{ padding: '70px 30px', backgroundColor: '#c8c2cc' }}>
    <div>
      The max height should be 80% of the viewport height, and should have scrollbars when this
      content overflows. <br />
      <br />
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi delectus architecto unde,
      illo nisi maxime blanditiis dicta explicabo reprehenderit fugiat veniam impedit voluptates
      fugit ipsum commodi id officiis, quam excepturi perferendis. Deleniti beatae inventore culpa
      consectetur ex, dignissimos dolor eaque? Lorem ipsum dolor sit amet consectetur adipisicing
      elit. Vel, odio. Delectus fugit ratione incidunt dolorum autem alias facilis, tempore tenetur
      architecto, maxime, aut totam nostrum sunt ut? Illum ratione, eveniet repudiandae nobis
      sapiente amet hic non, unde debitis quo voluptatum atque ut distinctio voluptatem ipsa? Quam
      odit quidem quasi dignissimos nostrum earum neque ex accusantium nihil consequatur! Culpa
      dignissimos, inventore recusandae facere minus quos architecto beatae molestiae voluptatibus,
      aliquam nobis exercitationem fugit esse consequuntur harum voluptates magnam suscipit eveniet?
      Minus explicabo voluptate molestias ex ad, itaque corporis cumque sed laborum labore culpa
      rerum id laudantium dolorem maiores porro doloremque! Nisi harum corporis sit. Rem dolorem
      ipsam sint quas ex in quae atque eum, rerum aut porro veniam officia voluptatibus dolores
      eveniet, nesciunt aspernatur totam sunt ullam? Commodi perspiciatis in doloremque consequuntur
      numquam amet? Laboriosam soluta recusandae, veritatis repudiandae deserunt consectetur id
      repellat sed quaerat laudantium error dolorem. Reprehenderit sed vel quas autem consectetur
      possimus voluptates aliquam laborum molestias harum a, doloribus dicta. Nihil optio illo
      officiis modi, soluta quam a harum, natus alias repudiandae laboriosam in. Quas autem
      repudiandae vel tenetur illo eius, perspiciatis iure alias minima. Accusamus accusantium cum
      itaque necessitatibus quia iusto, dicta ullam possimus. Ex, eligendi, eaque totam iste
      laboriosam ipsum consequuntur unde eum doloribus praesentium a vel maxime consequatur.
      Eligendi sequi cumque explicabo earum modi deserunt pariatur ratione veritatis aliquam
      consequuntur sunt perferendis doloremque officiis commodi necessitatibus corporis corrupti
      reprehenderit neque nihil, eaque rerum voluptate autem? Ab eum repellat animi, porro veniam
      nobis dolor ex numquam, consequuntur odio ducimus alias officia inventore optio. Architecto
      nemo voluptatem dolore nostrum ad. Neque vitae necessitatibus sunt saepe. Dolores corporis
      quod quia repudiandae necessitatibus illum, quo odit, dolorum alias sequi temporibus vitae
      inventore asperiores! Neque ipsam delectus odit, porro ea nam dolore voluptate hic impedit,
      autem mollitia libero odio? Odit necessitatibus tempore labore unde deserunt! Aut commodi
      doloribus laudantium tempora sunt, eos nostrum perferendis, animi debitis molestias rem ab.
      Repudiandae, fugiat. Ex, reiciendis. Quibusdam saepe alias libero similique, rem modi at autem
      labore adipisci quasi accusamus nemo! Asperiores, vitae doloremque! Ad inventore voluptatibus
      alias hic id unde eius quia laudantium excepturi omnis nemo, fugit ea vero accusamus vitae
      pariatur. Impedit eveniet qui, obcaecati error, sequi doloremque animi vel porro debitis quod
      iste aspernatur accusamus fuga odit vitae praesentium sed odio ut reiciendis autem tempore!
      Accusamus eaque ex dicta impedit, unde itaque exercitationem dolor, sunt fuga dignissimos
      officia vel perferendis commodi saepe nihil perspiciatis obcaecati dolorem veritatis ipsam
      rerum? Tempora ipsum doloribus maxime quia facilis saepe facere asperiores dolores assumenda
      eius obcaecati modi qui, perspiciatis eaque rerum praesentium, odio iusto. Mollitia quaerat
      possimus, fugit inventore ad dolores debitis sed corporis voluptatem laborum consequuntur
      voluptates reiciendis odio suscipit illo similique modi velit at ipsa veniam ipsum
      reprehenderit obcaecati porro itaque? Exercitationem velit possimus quae officia illo.
      Incidunt, omnis! Fugit voluptatem provident modi sapiente dolores, totam perferendis
      temporibus reprehenderit iure minima doloribus voluptatibus amet quisquam aperiam cumque quam
      mollitia dicta accusamus autem itaque voluptas placeat veritatis aliquid eaque. Delectus,
      assumenda aliquid placeat vel voluptatem debitis, dolore ut illo consequuntur, accusamus nulla
      nobis totam? Rerum, maxime cumque! Magnam sunt facere molestiae impedit id sed cupiditate quos
      culpa voluptas quo. Atque, nemo incidunt libero vitae molestiae necessitatibus nisi fugit
      magni ducimus sunt hic vel, dolores cupiditate deleniti molestias voluptates esse officia
      eaque magnam ipsa quae quos inventore consequatur totam? Culpa, beatae. Sunt voluptates illum
      assumenda, amet labore ratione enim quod beatae, voluptas explicabo vel. Pariatur soluta
      voluptate nemo, reiciendis, est nulla ab accusantium iure quasi delectus itaque. Ducimus
      consectetur suscipit ut nostrum sint nihil quaerat exercitationem minima, accusantium omnis
      beatae cupiditate error, dignissimos reprehenderit corporis? Enim illo unde vitae aliquid
      minus voluptatum laboriosam reiciendis qui, quibusdam assumenda iure porro architecto iste
      ratione harum? Debitis ut aut repudiandae voluptas. Aut repellendus eos distinctio, molestiae
      fugiat deleniti maxime, expedita repellat ipsam quas vero quo fuga voluptatibus sunt eius.
      Earum quibusdam, dicta alias eveniet numquam, aut voluptate quae quis a, obcaecati harum
      delectus illo optio eum! Eveniet similique esse hic iure? Esse, eius deserunt hic nihil
      minima, animi doloremque aspernatur voluptate dolor nesciunt unde veniam aut pariatur aliquid.
      Recusandae dolorem cupiditate, molestiae fuga quas odio blanditiis laudantium error minus
      tempore assumenda, sed incidunt perferendis rem vero laboriosam mollitia explicabo nihil
      laborum voluptates magni? Ea suscipit perspiciatis labore eaque pariatur earum, nostrum, unde
      explicabo, quisquam magnam a neque quos modi impedit minima. Iste, autem. Impedit harum iure
      nisi, iusto modi ex voluptatum temporibus quam numquam maiores architecto atque quos
      cupiditate nobis a delectus ratione aliquam vel repellat minima tenetur laudantium dolores
      porro suscipit! Eveniet dolorum libero minima nam. Modi labore tempora fugit inventore illo?
      Facilis esse vitae ut ducimus odit! Rem quae vitae dolores similique, cupiditate omnis
      possimus ratione? Consequatur inventore quia quae perspiciatis, incidunt deleniti ipsum
      voluptas, quibusdam voluptates fugiat optio eum vero ullam porro vel quam autem!
    </div>
  </div>,
  <div style={{ padding: '70px 30px', backgroundColor: '#ae9e8e' }}>
    <div>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur deserunt eius ad sequi
      provident, corporis rerum expedita amet enim perferendis?
    </div>
  </div>,
];

export const itemsAndComponents = items.map((item, i) => ({
  ...item,
  component: itemComponents[i],
}));

storiesOf('Watson IoT|TableDetailWizard', module)
  .add('Stateful example', () => (
    <StatefulTableDetailWizard
      currentItemId="step1"
      items={itemsAndComponents}
      title={text('title', 'Create Physical Interface')}
      showLabels={boolean('showLabels', true)}
      onClose={action('closed')}
      onSubmit={action('submit')}
      onNext={action('next')}
      onBack={action('back')}
      setItem={action('step clicked')}
    />
  ))
  .add('Static', () => (
    <TableDetailWizard
      items={itemsAndComponents}
      onBack={action('back')}
      onClose={action('Closed')}
      onNext={action('next')}
      onSubmit={action('submit')}
      title={text('title', 'Create Physical Interface')}
      currentItemId="step2"
      setItem={action('step clicked')}
      showLabels={boolean('showLabels', true)}
    />
  ))
  .add('with error', () => (
    <TableDetailWizard
      items={itemsAndComponents}
      onBack={action('back')}
      onClose={action('Closed')}
      onNext={action('next')}
      onSubmit={action('submit')}
      title={text('title', 'Create Physical Interface')}
      currentItemId="step1"
      setItem={action('step clicked')}
      showLabels={boolean('showLabels', true)}
      error="Error on the form"
      onClearError={action('clear error')}
    />
  ));

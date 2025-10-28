import React from 'react';

const categories = [
	{
		id: 'frutas',
		title: 'Frutas Frescas',
		description:
			'Nuestra selección de frutas frescas ofrece una experiencia directa del campo a tu hogar. Estas frutas se cultivan y cosechan en el punto óptimo de madurez para asegurar su sabor y frescura. Disfruta de una variedad de frutas de temporada que aportan vitaminas y nutrientes esenciales a tu dieta diaria. Perfectas para consumir solas, en ensaladas o como ingrediente principal en postres y smoothies.',
		features: ['Fresco', 'De Temporada', 'Nutritivo'],
		productCount: 3,
		image:
			'https://media.istockphoto.com/id/467652436/es/foto/mezcla-de-frutas-frescas.jpg?s=612x612&w=0&k=20&c=CJEx3NOdOKNzJ_1XokafBhz84h8_J6OOXvp1cfmIogQ=',
		icon: 'fas fa-apple-alt',
		link: '/productos?categoria=Frutas%20Frescas',
	},
	{
		id: 'verduras',
		title: 'Verduras Orgánicas',
		description:
			'Descubre nuestra gama de verduras orgánicas, cultivadas sin el uso de pesticidas ni químicos, garantizando un sabor auténtico y natural. Cada verdura es seleccionada por su calidad y valor nutricional, ofreciendo una excelente fuente de vitaminas, minerales y fibra. Ideales para ensaladas, guisos y platos saludables, nuestras verduras orgánicas promueven una alimentación consciente y sostenible.',
		features: ['Orgánico', 'Sin Pesticidas', 'Sostenible'],
		productCount: 3,
		image:
			'https://media.istockphoto.com/id/1203599923/es/foto/fondo-gastron%C3%B3mico-con-surtido-de-verduras-org%C3%A1nicas-frescas.jpg?s=170667a&w=0&k=20&c=1VdiE2kPhNDVbws9bEanQA2JEMR6xrBjrq1PHvkhLp0=',
		icon: 'fas fa-seedling',
		link: '/productos?categoria=Verduras%20Orgánicas',
	},
	{
		id: 'organicos',
		title: 'Productos Orgánicos',
		description:
			'Nuestros productos orgánicos están elaborados con ingredientes naturales y procesados de manera responsable para mantener sus beneficios saludables. Desde aceites y miel hasta granos y semillas, ofrecemos una selección que apoya un estilo de vida saludable y respetuoso con el medio ambiente. Estos productos son perfectos para quienes buscan opciones alimenticias que aporten bienestar sin comprometer el sabor ni la calidad.',
		features: ['Natural', 'Responsable', 'Saludable'],
		productCount: 2,
		image:
			'https://natureganix.store/cdn/shop/articles/Natural_1024x.jpg?v=1618006760',
		icon: 'fas fa-leaf',
		link: '/productos?categoria=Productos%20Orgánicos',
	},
	{
		id: 'lacteos',
		title: 'Productos Lácteos',
		description:
			'Los productos lácteos de HuertoHogar provienen de granjas locales que se dedican a la producción responsable y de calidad. Ofrecemos una gama de leches, yogures y otros derivados que conservan su frescura y sabor auténtico. Ricos en calcio y nutrientes esenciales, nuestros lácteos son perfectos para complementar una dieta equilibrada, proporcionando el mejor sabor y nutrición para toda la familia.',
		features: ['Local', 'Fresco', 'Nutritivo'],
		productCount: 1,
		image:
			'https://images.ecestaticos.com/5R1YUlQPhHlncdmKDsmSByzzAD4=/42x19:661x483/1200x899/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F773%2F094%2F19d%2F77309419d4585c2d4a3590623d2e9170.jpg',
		icon: 'fas fa-cheese',
		link: '/productos?categoria=Productos%20Lácteos',
	},
];

const Categories = () => {
	return (
		<section className="section-padding bg-light" id="categories">
			<div className="container">
				<div className="section-header text-center mb-5">
					<h2
						className="section-title fw-bold"
						style={{ fontSize: '2.5rem', letterSpacing: '1px' }}
					>
						Nuestras Categorías
					</h2>
					<p
						className="section-subtitle text-muted"
						style={{ fontSize: '1.2rem' }}
					>
						Descubre nuestra selección de productos frescos y naturales
					</p>
				</div>
				<div className="row">
					{categories.map((cat) => (
						<div
							key={cat.id}
							className="col-lg-6 col-md-6 col-12 mb-4 d-flex align-items-stretch"
						>
							<div
								className="card category-card w-100 border-0 shadow-sm"
								style={{
									borderRadius: '1rem',
									overflow: 'hidden',
									background: '#fff',
									minWidth: '220px',
									maxWidth: '500px',
									margin: '0 auto',
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								<img
									src={cat.image}
									alt={cat.title}
									style={{
										width: '100%',
										height: '180px',
										objectFit: 'cover',
									}}
								/>
								<div className="card-body p-4 d-flex flex-column justify-content-between">
									<h5
										className="card-title fw-bold text-center mb-2"
										style={{ fontSize: '1.35rem' }}
									>
										{cat.title}
									</h5>
									<p
										className="card-text text-muted mb-2 text-center"
										style={{ fontSize: '1rem', minHeight: '60px' }}
									>
										{cat.description}
									</p>
									<div className="category-features mb-2 d-flex flex-wrap justify-content-center">
										{cat.features.map((feature, idx) => (
											<span
												key={idx}
												className="feature-tag badge rounded-pill bg-success me-1 mb-1"
												style={{
													fontSize: '0.95rem',
													padding: '0.4em 1em',
												}}
											>
												{feature}
											</span>
										))}
									</div>
									<div className="product-count mb-2 text-center">
										<i
											className="fas fa-shopping-basket me-1"
											style={{ color: '#4caf50', fontSize: '1rem' }}
										></i>
										<span
											className="count-number fw-bold"
											style={{ fontSize: '1rem' }}
										>
											{cat.productCount}
										</span>{' '}
										{cat.productCount === 1
											? 'producto disponible'
											: 'productos disponibles'}
									</div>
									<a
										href={cat.link}
										className="category-link btn btn-warning btn-sm w-100 mt-2"
										style={{
											borderRadius: '1.5rem',
											fontWeight: 'bold',
											color: '#222',
											fontSize: '1rem',
										}}
									>
										Ver Productos{' '}
										<i className="fas fa-arrow-right ms-1"></i>
									</a>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<style>{`
        .category-card:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 6px 24px rgba(76, 175, 80, 0.12);
        }
        .feature-tag {
          background: #e8f5e9 !important;
          color: #388e3c !important;
          border: none;
        }
      `}</style>
		</section>
	);
};

export default Categories;
